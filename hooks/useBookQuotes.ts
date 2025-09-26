import { useState, useEffect } from "react";
import { storeObject, getObject } from "@/utils/async-storage";

// Each quote has an id + text
export type Quote = {
  id: string;
  text: string;
};

// Each book has an id, title, and a list of quotes
export type Book = {
  id: string;
  title: string;
  quotes: Quote[];
};

// Custom hook to manage books + quotes (load, save, add)
export const useBookQuotes = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // Load books from storage on first render
  useEffect(() => {
    const loadBooks = async () => {
      const saved = await getObject("books");
      if (saved) setBooks(saved as Book[]);
    };
    loadBooks();
  }, []);

  // Persist books whenever they change
  useEffect(() => {
    storeObject("books", books);
  }, [books]);

  // Add a quote to an existing book OR create a new book
  const addQuoteToBook = (title: string, quote: string) => {
    const newQuote: Quote = { id: Date.now().toString(), text: quote };

    setBooks((prevBooks) => {
      const existingBook = prevBooks.find(
        (book) => book.title.toLowerCase() === title.toLowerCase()
      );

      if (existingBook) {
        // Add quote to existing book
        return prevBooks.map((book) =>
          book.id === existingBook.id
            ? { ...book, quotes: [...book.quotes, newQuote] }
            : book
        );
      } else {
        // Or create a new book
        return [
          ...prevBooks,
          { id: Date.now().toString(), title, quotes: [newQuote] },
        ];
      }
    });
  };

  return { books, addQuoteToBook };
};
