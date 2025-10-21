// utils/fetchBookCover.ts
export async function fetchBookCover(title: string): Promise<string | undefined> {
    if (!title || title.trim().length < 2) return undefined;
  
    try {
      const query = encodeURIComponent(title.trim());
      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}&maxResults=1`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      const imageLinks = data.items?.[0]?.volumeInfo?.imageLinks;
      if (!imageLinks) return undefined;
  
      const uri = imageLinks.thumbnail || imageLinks.smallThumbnail;
      return uri ? uri.replace("http:", "https:") : undefined; // ensure HTTPS
    } catch (error) {
      console.warn("fetchBookCover error:", error);
      return undefined;
    }
  }
  