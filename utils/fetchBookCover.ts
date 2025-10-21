// utils/fetchBookCover.ts (UPDATED)

interface BookData {
  coverUri?: string;
  title?: string; // New field for the formal title/author
}

// Renaming the exported function to reflect its new, broader purpose
export async function fetchBookData(query: string): Promise<BookData | undefined> {
  if (!query || query.trim().length < 2) return undefined;

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    // Using a broad query (no "intitle:") for better matches with OCR text
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=1`;

    const response = await fetch(url);
    const data = await response.json();

    const item = data.items?.[0]?.volumeInfo;
    if (!item) return undefined;

    // 1. Get Cover URI
    const imageLinks = item.imageLinks;
    let coverUri: string | undefined = undefined;
    if (imageLinks) {
      // Prioritize large thumbnail
      const uri = imageLinks.thumbnail || imageLinks.smallThumbnail;
      // Ensure HTTPS
      coverUri = uri ? uri.replace("http:", "https:") : undefined;
    }

    // 2. Format Title & Author
    const bookTitle = item.title;
    const bookAuthor = item.authors ? item.authors.join(", ") : null;

    let formalTitle: string | undefined = undefined;
    // Format as "Title - Author" for better presentation
    if (bookTitle) {
      formalTitle = bookAuthor ? `${bookTitle} - ${bookAuthor}` : bookTitle;
    }

    return {
      coverUri: coverUri,
      title: formalTitle,
    };
  } catch (error) {
    console.warn("fetchBookData error:", error);
    return undefined;
  }
}