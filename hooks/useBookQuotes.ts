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

import { useAuth } from "@/context/AuthContext";

// Types
export type Quote = { id: string; text: string };
export type Book = { id: string; title: string; quotes: Quote[]; coverUri?: string };

export const useBookQuotes = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { user } = useAuth();

  // Get userId or use 'anonymous' as fallback
  const userId = user?.uid || 'anonymous';

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    const loadBooks = async () => {
      // 1. Initialize DB (ensures tables exist)
      await initDatabase();

      // 2. Load data for current user from SQLite
      const sqlBooks = await getBooksWithQuotes(userId);
      setBooks(sqlBooks);
    };

    loadBooks().catch(console.error);
  }, [userId]); // Reload when user changes

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
      await insertBook(bookId, userId, title, coverUri);
      await insertQuote(quoteId, bookId, quote);
    }

    // Refresh local state after all writes are complete
    const updated = await getBooksWithQuotes(userId);
    setBooks(updated);

  }, [books, userId]);

  const removeBookById = useCallback(async (bookId: string) => {
    await deleteBook(bookId, userId);
    const updated = await getBooksWithQuotes(userId);
    setBooks(updated);

  }, [userId]);

  const removeQuoteById = useCallback(async (quoteId: string) => {
    await deleteQuote(quoteId);
    const updated = await getBooksWithQuotes(userId);
    setBooks(updated);
  }, [userId]);

  const editQuote = useCallback(async (quoteId: string, newText: string) => {
    await updateQuote(quoteId, newText);
    const updated = await getBooksWithQuotes(userId);
    setBooks(updated);
  }, [userId]);

  const editBookTitle = useCallback(async (bookId: string, newTitle: string) => {
    await updateBookTitle(bookId, userId, newTitle);
    const updated = await getBooksWithQuotes(userId);
    setBooks(updated);
  }, [userId]);

  return {
    books,
    addQuoteToBook,
    removeBookById,
    removeQuoteById,
    editQuote,
    editBookTitle,
  };
};