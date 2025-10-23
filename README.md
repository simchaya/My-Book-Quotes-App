# 📚 MarkItDown

**To be kept forever.**

MarkItDown is a mobile app that streamlines the process of collecting book quotes through smart camera integration. You can capture passages directly from physical books, with future development aimed at incorporating social features.

---

## 📖 What does it do?

Take a photo of your book cover. Snap a picture of a quote. Done.

All your favorite passages, organized by book, always with you.

---

## 🎥 See it in action

<table>
<tr>
<td>
  <video width="300" src="https://github.com/user-attachments/assets/baf7346b-d01b-48f9-b5c4-c71d60f2c218" controls></video>
</td>
<td>
  <video width="300" src="https://github.com/user-attachments/assets/f11c20b2-0a12-40f7-b3d0-6a2cff24855b" controls></video>
</td>
<td> 
  <video width="300" src="https://github.com/user-attachments/assets/f62e7680-1eef-4350-a99c-00fdeb0257b3" controls></video>
</td>
</tr>
</table>

•   Adding a book with cover recognition   •   Capturing quotes with OCR camera   •   Getting started and about page

---

## ✨ Features

📸 **Snap your book cover** - The app reads the title and author for you, no typing needed

🔍 **Capture quotes instantly** - Point your camera at any page, the text appears automatically

💭 **Add your thoughts** - Write notes next to quotes to remember why they moved you

🔐 **Your private collection** - Secure login keeps your library personal

📚 **All your books together** - Beautiful covers, organized quotes, always at your fingertips

🌙 **Light and dark mode** - Easy on the eyes, day or night

---

## 🚀 Try it yourself

**You'll need:**
- An iPhone or Android phone
- The free "Expo Go" app
- 5 minutes

**Setup:**

1. **On your computer:**
   ```bash
   git clone https://github.com/simchaya/My-Book-Quotes-App.git
   cd MarkItDown
   npm install
   npx expo start
   ```

2. **On your phone:**
   - Download "Expo Go" from the App Store or Google Play
   - Scan the QR code that appears on your computer screen

3. **Start capturing quotes!**

*Note: This is a mobile app—camera features only work on real phones, not in a web browser.*

---

## 💡 How it works

1. **Snap your book cover** → App automatically fills in title, author, and finds the cover image
2. **Capture a quote** → Point your camera at the page, text appears instantly
3. **Add your thought** → Write why this quote matters to you (optional but powerful)
4. **Read more intentionally** → Knowing you can save great moments makes you notice them more

Your personal library grows with every book you love.

---

## 📝 Technical note

The camera features use Google Cloud Vision API for text recognition (OCR). The app connects to a cloud function to process images and extract text.

If you're running your own instance, you'll need to set up the Google Cloud Vision endpoint (see `/cloud-function/` folder). Otherwise, you can type quotes manually.

---

## 🎯 Why I built this

I kept losing the quotes that made me stop and think. But more than that, I noticed something: when I knew I'd capture a great quote, I read more intentionally. I paid closer attention.

MarkItDown is designed to make reading more rewarding. The act of capturing a quote—snapping a photo, adding your thought about why it matters, makes you engage deeper with what you're reading.

It's not just about saving quotes. It's about reading more.

---

## 🔮 What's next?

- Native OCR integration - Use iPhone Live Text or Google Lens directly
- Discover feature - Explore and save quotes shared by other readers
- Social reading - Connect with book lovers and see what they're highlighting
  
---

## 🤝 Want to help?

Found a bug? Have an idea? Open an issue or reach out!

This is a learning project, and I'd love your feedback.

---

## 👩‍💻  Made by

**Simcha biton Shack**  
Book lover • Developer • [GitHub](https://github.com/simchaya)

---

**For book lovers, by a book lover** ❤️📚
