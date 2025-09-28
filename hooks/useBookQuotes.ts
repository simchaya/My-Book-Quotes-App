import { getObject, storeObject } from "@/utils/async-storage";
import { uniqueId } from "@/utils/id"; // helper to generate unique IDs safely
import { useEffect, useState } from "react";


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

export const useBookQuotes = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // Load books from storage on first render
  useEffect(() => {
    const loadBooks = async () => {
      const saved = await getObject("books");
      if (saved) {
        // ensure every book + quote has an id
        const fixed = (saved as Book[]).map((b) => ({
          ...b,
          id: b.id ?? uniqueId(),
          quotes: b.quotes.map((q) => ({
            ...q,
            id: q.id ?? uniqueId(),
          })),
        }));
        setBooks(fixed);

        // save back fixed data so it persists
        storeObject("books", fixed);
      }
    };
    loadBooks();
  }, []);

  // Persist books whenever they change
  useEffect(() => {
    storeObject("books", books);
  }, [books]);

  // Add a quote to an existing book OR create a new book
  const addQuoteToBook = (title: string, quote: string) => {
    const newQuote: Quote = { id: uniqueId(), text: quote };

    setBooks((prevBooks) => {
      const existingBook = prevBooks.find(
        (book) => book.title.toLowerCase() === title.toLowerCase()
      );

      if (existingBook) {
        return prevBooks.map((book) =>
          book.id === existingBook.id
            ? { ...book, quotes: [...book.quotes, newQuote] }
            : book
        );
      } else {
        return [
          ...prevBooks,
          { id: uniqueId(), title, quotes: [newQuote] },
        ];
      }
    });
  };

  return { books, addQuoteToBook };
};
