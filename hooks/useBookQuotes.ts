import { generateId } from "@/utils";
import { useCallback, useEffect, useState } from "react";

import {
  deleteBook,
  deleteQuote,
  getBooksWithQuotes,
  initDatabase,
  insertBook,
  insertQuote,
  updateBookTitle,
  updateQuote,
} from "@/utils/database";

// Types
export type Quote = { id: string; text: string };
export type Book = { id: string; title: string; quotes: Quote[]; coverUri?: string };

export const useBookQuotes = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    const loadBooks = async () => {
      // 1. Initialize DB (ensures tables exist)
      await initDatabase();

      // 2. Load all current data from SQLite and set state
      const sqlBooks = await getBooksWithQuotes();
      setBooks(sqlBooks);
    };

    loadBooks().catch(console.error);
  }, []);

  // -----------------------------
  // CRUD OPERATIONS
  // -----------------------------

  const addQuoteToBook = useCallback(async (title: string, quote: string, coverUri?: string) => {
    const existing = books.find(
      (b) => b.title.toLowerCase() === title.toLowerCase()
    );

    const quoteId = generateId();

    if (existing) {
      await insertQuote(quoteId, existing.id, quote);
    } else {
      const bookId = generateId();
      await insertBook(bookId, title, coverUri);
      await insertQuote(quoteId, bookId, quote);
    }

    // Refresh local state after all writes are complete
    const updated = await getBooksWithQuotes();
    setBooks(updated);

  }, [books]);

  const removeBookById = useCallback(async (bookId: string) => {
    await deleteBook(bookId);
    const updated = await getBooksWithQuotes();
    setBooks(updated);

  }, []);

  const removeQuoteById = useCallback(async (quoteId: string) => {
    await deleteQuote(quoteId);
    const updated = await getBooksWithQuotes();
    setBooks(updated);
  }, []);

  const editQuote = useCallback(async (quoteId: string, newText: string) => {
    await updateQuote(quoteId, newText);
    const updated = await getBooksWithQuotes();
    setBooks(updated);
  }, []);

  const editBookTitle = useCallback(async (bookId: string, newTitle: string) => {
    await updateBookTitle(bookId, newTitle);
    const updated = await getBooksWithQuotes();
    setBooks(updated);
  }, []);

  return {
    books,
    addQuoteToBook,
    removeBookById,
    removeQuoteById,
    editQuote,
    editBookTitle,
  };
};