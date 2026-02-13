"use client";

import { useState, useEffect } from "react";
import { NewsItem } from "@/lib/api";
import styles from "./NewsFeed.module.css";

interface NewsFeedProps {
    news: NewsItem[];
}

interface SeenNews {
    id: string; // Using URL as ID
    timestamp: number;
}

export default function NewsFeed({ news }: NewsFeedProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        // 1. Load existing seen news
        const stored = localStorage.getItem("seenNews");
        let seenNews: SeenNews[] = stored ? JSON.parse(stored) : [];

        // 2. Filter out expired (> 24h)
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        seenNews = seenNews.filter(item => (now - item.timestamp) < oneDayMs);

        // 3. Update state with currently valid seen IDs (for rendering)
        setSeenIds(new Set(seenNews.map(item => item.id)));

        // 4. Add current news to the seen list (for next time)
        // We only add items that are NOT already in the list to update their timestamp? 
        // Or keep original timestamp? usually "first seen".
        // Let's add new ones.
        const existingIds = new Set(seenNews.map(item => item.id));
        let hasChanges = false;

        news.forEach(item => {
            if (!existingIds.has(item.url)) {
                seenNews.push({ id: item.url, timestamp: now });
                existingIds.add(item.url);
                hasChanges = true;
            }
        });

        // 5. Save back to local storage
        if (hasChanges || seenNews.length !== (stored ? JSON.parse(stored).length : 0)) {
            localStorage.setItem("seenNews", JSON.stringify(seenNews));
        }

    }, [news]);

    const toggleItem = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } catch (e) {
            return "";
        }
    };

    if (news.length === 0) {
        return (
            <div className={styles.feed}>
                <p className={styles.description}>No news in the last 24 hours.</p>
            </div>
        );
    }

    return (
        <div className={styles.feed}>
            {news.map((item, index) => {
                const isExpanded = expandedIndex === index;
                return (
                    <article key={index} className={styles.item}>
                        <button
                            className={styles.summary}
                            onClick={() => toggleItem(index)}
                            aria-expanded={isExpanded}
                            aria-controls={`content-${index}`}
                        >
                            <h2
                                className={styles.title}
                                style={{ opacity: seenIds.has(item.url) ? 0.6 : 1 }}
                            >
                                {item.title}
                            </h2>
                            <time className={styles.time} dateTime={item.date} suppressHydrationWarning>
                                {formatTime(item.date)}
                            </time>
                        </button>
                        <div
                            id={`content-${index}`}
                            className={`${styles.descriptionWrapper} ${isExpanded ? styles.expanded : ""
                                }`}
                            aria-hidden={!isExpanded}
                        >
                            <div className={styles.descriptionContent}>
                                <p className={styles.description}>{item.description}</p>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.readMore}
                                >
                                    Read full story →
                                </a>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
