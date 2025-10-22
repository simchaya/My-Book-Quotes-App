# 📚 MarkItDown

**Never lose a beautiful quote again.**

MarkItDown helps you capture and save your favorite book quotes—right from your phone.

---

## 📖 What does it do?

Take a photo of your book cover. Snap a picture of a quote. Done.

All your favorite passages, organized by book, always with you.

---

## 🎥 See it in action

![Demo Video](./assets/demo1.mp4)

*A quick walkthrough of adding a book and capturing quotes*

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
   git clone https://github.com/yourusername/markitdown.git
   cd markitdown
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

MarkItDown is designed to make reading more rewarding. The act of capturing a quote—snapping a photo, adding your thought about why it matters—makes you engage deeper with what you're reading.

It's not just about saving quotes. It's about reading better.

---

## 🤝 Want to help?

Found a bug? Have an idea? Open an issue or reach out!

This is a learning project, and I'd love your feedback.

---

## 👤 Made by

**Simcha biton Shack**  
Book lover • Developer • [GitHub](https://github.com/simchaya)

---

**For book lovers, by a book lover** ❤️📚