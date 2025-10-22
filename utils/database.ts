// utils/database.ts
import { Book } from "@/hooks/useBookQuotes";
import * as SQLite from "expo-sqlite";

// Open the database once
const db = SQLite.openDatabaseSync("markitdown.db");

// ----------------------
// Schema Initialization
// ----------------------
export const initDatabase = async () => {
    await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      coverUri TEXT
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY NOT NULL,
      bookId TEXT NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
    );

    -- Create index for faster userId lookups
    CREATE INDEX IF NOT EXISTS idx_books_userId ON books(userId);
  `);
};

// ----------------------
// CRUD HELPERS
// ----------------------

// --- Insert ---
export const insertBook = async (id: string, userId: string, title: string, coverUri?: string) => {
    await db.runAsync(
        "INSERT OR IGNORE INTO books (id, userId, title, coverUri) VALUES (?, ?, ?, ?)",
        [id, userId, title.trim(), coverUri ?? null]
    );
};

export const insertQuote = async (id: string, bookId: string, text: string) => {
    await db.runAsync(
        "INSERT INTO quotes (id, bookId, text) VALUES (?, ?, ?)",
        [id, bookId, text.trim()]
    );
};

// --- Delete ---
export const deleteBook = async (bookId: string, userId: string) => {
    // Safety: only delete if book belongs to this user
    await db.runAsync("DELETE FROM books WHERE id = ? AND userId = ?", [bookId, userId]);
};

export const deleteQuote = async (quoteId: string) => {
    await db.runAsync("DELETE FROM quotes WHERE id = ?", [quoteId]);
};

// --- Update ---
export const updateQuote = async (quoteId: string, newText: string) => {
    await db.runAsync("UPDATE quotes SET text = ? WHERE id = ?", [newText.trim(), quoteId]);
};

// Update a book's title
export const updateBookTitle = async (bookId: string, userId: string, newTitle: string) => {
    // Safety: only update if book belongs to this user
    await db.runAsync(
        "UPDATE books SET title = ? WHERE id = ? AND userId = ?",
        [newTitle.trim(), bookId, userId]
    );
};

// ----------------------
// Optimized Data Fetch
// ----------------------

// Flattened type for JOIN results
type BookQuoteRow = {
    id: string;
    userId: string;
    title: string;
    coverUri?: string | null;
    quote_id?: string | null;
    quote_text?: string | null;
};

/**
 * Optimized: Single LEFT JOIN query filtered by userId.
 * Returns an array of books for the specific user, each with its quotes[] attached.
 */
export const getBooksWithQuotes = async (userId: string): Promise<Book[]> => {
    const rows: BookQuoteRow[] = await db.getAllAsync(`
    SELECT
      b.id,
      b.userId,
      b.title,
      b.coverUri,
      q.id   AS quote_id,
      q.text AS quote_text
    FROM books b
    LEFT JOIN quotes q ON b.id = q.bookId
    WHERE b.userId = ?
    ORDER BY LOWER(b.title) ASC, q.id ASC;
  `, [userId]);

    const booksMap = new Map<string, Book>();

    for (const row of rows) {
        const { id, title, coverUri, quote_id, quote_text } = row;

        // Create book entry if not seen
        if (!booksMap.has(id)) {
            booksMap.set(id, {
                id,
                title,
                coverUri: coverUri ?? undefined,
                quotes: [],
            });
        }

        // Append quote if present
        if (quote_id && quote_text) {
            booksMap.get(id)!.quotes.push({ id: quote_id, text: quote_text });
        }
    }

    // Return all books in sorted order
    return Array.from(booksMap.values());
};

// ----------------------
// Database Reset (For Development)
// ----------------------

/**
 * Completely drops and recreates all tables.
 * Use this to fix "no such column" errors.
 */
export const resetDatabase = async () => {
    try {
        console.log('🗑️ Dropping all tables...');
        await db.execAsync(`
            DROP TABLE IF EXISTS quotes;
            DROP TABLE IF EXISTS books;
        `);
        console.log('✅ Tables dropped');

        // Recreate with new schema
        await initDatabase();
        console.log('✅ Database reset complete with userId support');
    } catch (error) {
        console.error('Reset error:', error);
        throw error;
    }
};