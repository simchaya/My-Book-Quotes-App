import { act, renderHook, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useBookInput } from "../useBookInput";

// Mock Alert
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock ImagePicker
jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock FileSystem
jest.mock("expo-file-system/legacy", () => ({
  readAsStringAsync: jest.fn(),
}));

describe("useBookInput", () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useBookInput(mockOnSave));
    
    expect(result.current.title).toBe("");
    expect(result.current.quote).toBe("");
    expect(result.current.coverUri).toBeNull();
  });

  it("updates title and quote", () => {
    const { result } = renderHook(() => useBookInput(mockOnSave));
    
    act(() => {
      result.current.setTitle("My Book");
      result.current.setQuote("Great quote");
    });
    
    expect(result.current.title).toBe("My Book");
    expect(result.current.quote).toBe("Great quote");
  });
  
  it("calls onSave with trimmed values when fields are filled", async () => {
    const { result } = renderHook(() => useBookInput(mockOnSave));
    
    act(() => {
      result.current.setTitle("  Book Title  ");
      result.current.setQuote("  Quote Text  ");
    });
    
    act(() => {
      result.current.handleSave();
    });
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith("Book Title", "Quote Text", undefined);
    });
  });
  
  it("shows alert when fields are empty", () => {
    const { result } = renderHook(() => useBookInput(mockOnSave));
    
    act(() => {
      result.current.handleSave();
    });
    
    expect(Alert.alert).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });
  
  it("resets state after successful save", async () => {
    const { result } = renderHook(() => useBookInput(mockOnSave));
    
    act(() => {
      result.current.setTitle("Book");
      result.current.setQuote("Quote");
    });
    
    act(() => {
      result.current.handleSave();
    });
    
    await waitFor(() => {
      expect(result.current.title).toBe("");
      expect(result.current.quote).toBe("");
      expect(result.current.coverUri).toBeNull();
    });
  });

});