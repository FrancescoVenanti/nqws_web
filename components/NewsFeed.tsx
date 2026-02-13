"use client";

import { useState } from "react";
import { NewsItem } from "@/lib/api";
import styles from "./NewsFeed.module.css";

interface NewsFeedProps {
    news: NewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
                            <h2 className={styles.title}>{item.title}</h2>
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
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
