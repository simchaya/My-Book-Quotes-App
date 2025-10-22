/**
 * Google Cloud Function to securely handle OCR requests for the Expo app.
 *
 * This function performs three main duties:
 * 1. Request Handling: Sets CORS headers and processes the HTTP request/response.
 * 2. Input Validation: Ensures the incoming image data is present and valid.
 * 3. Core Logic: Calls the Google Cloud Vision API with the image data.
 *
 * It uses modular helper functions to ensure clear separation of these concerns.
 *
 * Deployment Command (After setting up gcloud CLI and authentication):
 * gcloud functions deploy ocrHandler \
 * --runtime nodejs20 \
 * --trigger-http \
 * --allow-unauthenticated \
 * --region=us-central1 \
 * --entry-point ocrHandler
 */

// Import the Google Cloud Vision API Client Library
const { ImageAnnotatorClient } = require('@google-cloud/vision');

// Initialize the client outside of the main function for better performance
// The client will automatically use the Service Account credentials assigned
const visionClient = new ImageAnnotatorClient();

// --------------------------------------------------------------------------
// 1. CORE LOGIC: Vision API Interaction (Separation of Concerns: Vision)
// --------------------------------------------------------------------------

/**
 * Calls the Google Cloud Vision API to perform text detection (OCR).
 *
 * @param {string} base64Image The image data encoded in Base64 format.
 * @returns {Promise<string>} The extracted text from the image.
 * @throws {Error} If the Vision API call fails or returns no text.
 */
async function performOcr(base64Image) {
  // Construct the request object for the Vision API
  const request = {
    image: {
      content: base64Image,
    },
    features: [{ type: 'TEXT_DETECTION' }],
  };

  // Call the Vision API
  const [result] = await visionClient.annotateImage(request);

  // Check if text was successfully detected
  const fullTextAnnotation = result.fullTextAnnotation;
  if (!fullTextAnnotation || !fullTextAnnotation.text) {
    // If no text is found, return an empty string to indicate success but no result
    return "";
  }

  // The fullTextAnnotation.text contains all the text detected in the image
  return fullTextAnnotation.text.trim();
}

// --------------------------------------------------------------------------
// 2. HELPER: Input Validation (Separation of Concerns: Validation)
// --------------------------------------------------------------------------

/**
 * Validates the incoming request body.
 *
 * @param {object} body The JSON request body.
 * @throws {Error} If validation fails.
 * @returns {string} The base64 string if valid.
 */
function validateRequest(body) {
  if (!body || !body.image) {
    throw new Error('Invalid request body. Missing "image" property.');
  }

  // Robustly handle if the Expo app adds a prefix, otherwise use the raw Base64 data.
  const base64Image = body.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  if (!base64Image) {
    throw new Error('The image data cannot be empty.');
  }

  // Simple check to ensure it looks like Base64 (starts with M, P, R, or / and ends with A-Z)
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64Image)) {
    throw new Error('Image data is not a valid Base64 string.');
  }

  return base64Image;
}

// --------------------------------------------------------------------------
// 3. MAIN EXPORT: Request Handling & Orchestration
// --------------------------------------------------------------------------

/**
 * Main HTTP entry point for the Google Cloud Function.
 * Handles CORS, orchestrates validation and OCR logic, and sends the response.
 *
 * @param {object} req HTTP request object.
 * @param {object} res HTTP response object.
 */
exports.ocrHandler = async (req, res) => {
  // Set up CORS to allow requests from your Expo app running on any origin (e.g., localhost, tunneling URL)
  res.set('Access-Control-Allow-Origin', '*');

  // Handle pre-flight CORS requests
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  // Only allow POST requests for the actual OCR job
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method Not Allowed. Only POST is accepted.' });
  }

  try {
    // 1. Validate and extract image data
    const base64Image = validateRequest(req.body);
    //Log the image data size to confirm a valid image was received
    console.log(`Received image data size: ${base64Image.length} bytes.`);

    // 2. Perform the core OCR logic
    const extractedText = await performOcr(base64Image);

    // 3. Respond with the extracted text
    // send a success (200) response containing the extracted text.
    res.status(200).send({
      success: true,
      text: extractedText,
      message: extractedText ? 'Text successfully extracted.' : 'No text detected in the image.',
    });

  } catch (error) {
    console.error('OCR Error:', error.message || error);
    // Send a generic error response to the client
    res.status(500).send({
      success: false,
      error: 'An internal server error occurred during OCR processing.',
      details: error.message, // For debugging
    });
  }
};

