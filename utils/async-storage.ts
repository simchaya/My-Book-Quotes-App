import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save a plain string value.
 */
export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error storing string value:", error);
  }
};

/**
 * Retrieve a plain string value.
 */
export const getData = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error("Error reading string value:", error);
  }
};

/**
 * Delete an item by key.
 */
export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting value:", error);
  }
};

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
