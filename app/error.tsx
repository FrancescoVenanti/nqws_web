"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{ padding: "2rem 0", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem", color: "var(--text-color)" }}>
                Something went wrong!
            </h2>
            <p style={{ marginBottom: "1.5rem", color: "var(--muted-text)" }}>
                {error.message || "Failed to load news."}
            </p>
            <button
                onClick={() => reset()}
                style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-color)",
                }}
            >
                Try again
            </button>
        </div>
    );
}
