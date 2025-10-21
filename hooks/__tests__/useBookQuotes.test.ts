import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useBookQuotes } from "../useBookQuotes";


// Mock database
jest.mock("@/utils/database", () => ({
    initDatabase: jest.fn().mockResolvedValue(undefined),
    getBooksWithQuotes: jest.fn().mockResolvedValue([]),
    insertBook: jest.fn(),
    insertQuote: jest.fn(),
    deleteBook: jest.fn(),
    deleteQuote: jest.fn(),
    updateQuote: jest.fn(),
    updateBookTitle: jest.fn(),
}));

// Mock generateId
jest.mock("@/utils", () => ({
    generateId: jest.fn().mockReturnValue("mock-id"),
}));

describe("useBookQuotes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("initializes with empty books array", async () => {
        const { result } = renderHook(() => useBookQuotes());

        await waitFor(() => {
            expect(result.current.books).toEqual([]);
        });
    });

    it("calls initDatabase on mount", async () => {
        const { initDatabase } = require("@/utils/database");

        renderHook(() => useBookQuotes());

        await waitFor(() => {
            expect(initDatabase).toHaveBeenCalledTimes(1);
        });
    });

    it("adds quote to existing book", async () => {
        const { getBooksWithQuotes, insertQuote, insertBook } = require("@/utils/database");

        const existingBook = { id: "book-1", title: "Existing Book", quotes: [] };

        // Mock: first call returns existing book, second call returns it again after insert
        (getBooksWithQuotes as jest.Mock)
            .mockResolvedValueOnce([existingBook])
            .mockResolvedValueOnce([existingBook]);

        const { result } = renderHook(() => useBookQuotes());

        // Wait for initial load
        await waitFor(() => {
            expect(result.current.books).toEqual([existingBook]);
        });

        // Add a quote to the existing book
        await act(async () => {
            await result.current.addQuoteToBook("Existing Book", "New quote");
        });

        // Verify insertQuote was called, but NOT insertBook
        expect(insertQuote).toHaveBeenCalledWith("mock-id", "book-1", "New quote");
        expect(insertBook).not.toHaveBeenCalled();
    });

    it("matches book title case-insensitively", async () => {
        const { getBooksWithQuotes, insertQuote, insertBook } = require("@/utils/database");
        
        const existingBook = { id: "book-1", title: "My Book", quotes: [] };
        
        (getBooksWithQuotes as jest.Mock)
          .mockResolvedValueOnce([existingBook])
          .mockResolvedValueOnce([existingBook]);
        
        const { result } = renderHook(() => useBookQuotes());
        
        await waitFor(() => {
          expect(result.current.books).toEqual([existingBook]);
        });
        
        // Add quote with different case - should still match
        await act(async () => {
          await result.current.addQuoteToBook("MY BOOK", "New quote");
        });
        
        // Should match existing book, not create new one
        expect(insertQuote).toHaveBeenCalledWith("mock-id", "book-1", "New quote");
        expect(insertBook).not.toHaveBeenCalled();
      });

      it("creates new book when title does not exist", async () => {
        const { getBooksWithQuotes, insertQuote, insertBook } = require("@/utils/database");
        
        // Start with empty books array
        (getBooksWithQuotes as jest.Mock)
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([]);
        
        const { result } = renderHook(() => useBookQuotes());
        
        await waitFor(() => {
          expect(result.current.books).toEqual([]);
        });
        
        // Add quote to a new book
        await act(async () => {
          await result.current.addQuoteToBook("New Book", "First quote");
        });
        
        // Should create both book and quote
        expect(insertBook).toHaveBeenCalledWith("mock-id", "New Book", undefined);
        expect(insertQuote).toHaveBeenCalledWith("mock-id", "mock-id", "First quote");
      });

      it("removes a book by ID", async () => {
        const { deleteBook } = require("@/utils/database");
        
        const { result } = renderHook(() => useBookQuotes());
        
        await act(async () => {
          await result.current.removeBookById("book-123");
        });
        
        expect(deleteBook).toHaveBeenCalledWith("book-123");
      });

      it("removes a quote by ID", async () => {
        const { deleteQuote } = require("@/utils/database");
        
        const { result } = renderHook(() => useBookQuotes());
        
        await act(async () => {
          await result.current.removeQuoteById("quote-456");
        });
        
        expect(deleteQuote).toHaveBeenCalledWith("quote-456");
      });
      
      it("edits a quote", async () => {
        const { updateQuote } = require("@/utils/database");
        
        const { result } = renderHook(() => useBookQuotes());
        
        await act(async () => {
          await result.current.editQuote("quote-123", "Updated text");
        });
        
        expect(updateQuote).toHaveBeenCalledWith("quote-123", "Updated text");
      });
      
      it("edits a book title", async () => {
        const { updateBookTitle } = require("@/utils/database");
        
        const { result } = renderHook(() => useBookQuotes());
        
        await act(async () => {
          await result.current.editBookTitle("book-789", "New Title");
        });
        
        expect(updateBookTitle).toHaveBeenCalledWith("book-789", "New Title");
      });

});