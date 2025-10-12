// src/utils/id.ts

// Generates a unique ID using timestamp + random suffix
export const generateId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2);
  