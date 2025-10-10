import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save an object/array (converts to JSON).
 * Example: storeObject("books", [{ id: "1", title: "Book", quotes: [] }])
 */
export const storeObject = async (key: string, value: unknown) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("Error storing object:", error);
  }
};

/**
 * Retrieve an object/array (parses from JSON).
 * Example: const books = await getObject("books");
 */
export const getObject = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error reading object:", error);
    return null;
  }
};

/**
 * Delete an item by key.
 * deleteObject will  not be called for deleting a book or quote. 
 * These actions are handled by updating the books array in the hook 
 * and then calling storeObject to save the new array.
 * The deleteObject function is only for wiping the entire storage key
 * (e.g., clearing all data). currently there isn't a button to allow this
 */
export const deleteObject = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting value:", error);
  }
};
