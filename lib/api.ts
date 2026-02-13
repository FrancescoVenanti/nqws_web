export interface NewsItem {
  title: string;
  description: string;
  date: string; // ISO string
  url: string;
  source?: string;
}

interface NewsResponse {
  success: boolean;
  data: RawNewsItem[];
}

interface RawNewsItem {
  title_en: string;
  title: string;
  summary_en: string;
  summary: string;
  published_at: string;
  link: string;
  source: string;
}

// ... (interfaces remain the same)

const API_URL = "https://notizie-ai-agent.news-agent.workers.dev/api/news";

export type Language = "en" | "it";

export async function fetchNews(lang: Language = "en"): Promise<NewsItem[]> {
  try {
    const params = new URLSearchParams({
      limit: "50",
      lang: lang,
    });

    const res = await fetch(`${API_URL}?${params.toString()}`, {
      // Revalidate every minute or so, or no-cache for "today's news"
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.status}`);
    }

    const json: NewsResponse = await res.json();

    if (!json.success) {
      throw new Error("API returned success: false");
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Provide a fallback if json.data is undefined
    const rawItems = json.data || [];

    const newsItems: NewsItem[] = rawItems.map((item) => {
      // Map based on language. 
      // Note: The API might return both EN and IT fields regardless of 'lang' param, 
      // or 'lang' param might filter them on server.
      // We will prefer the requested language fields, falling back to the other if missing.

      let title, description;
      if (lang === 'it') {
        title = item.title || item.title_en;
        description = item.summary || item.summary_en;
      } else {
        title = item.title_en || item.title;
        description = item.summary_en || item.summary;
      }

      return {
        title: title,
        description: description,
        date: item.published_at,
        url: item.link,
        source: item.source,
      };
    });

    const filteredNews = newsItems.filter((item) => {
      // 1. Description exists and not empty
      if (!item.description || item.description.trim() === "") return false;

      // 2. Date within last 24 hours
      const itemDate = new Date(item.date);
      if (isNaN(itemDate.getTime())) return false; // Invalid date
      if (itemDate < oneDayAgo) return false;

      return true;
    });

    return filteredNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error; // Re-throw to be handled by error.tsx
  }
}
