"use client";

import { useEffect, useRef } from "react";
import styles from "./SettingsModal.module.css";
import { useAppearance } from "./AppearanceProvider";
import AppLinks from "./AppLinks";
import { useRouter, useSearchParams } from "next/navigation";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const {
        theme, setTheme,
        fontSize, setFontSize,
        fontFamily, setFontFamily
    } = useAppearance();

    const router = useRouter();
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "en";
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape & click outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLangChange = (newLang: string) => {
        router.push(`/?lang=${newLang}`);
    };

    return (
        <div className={styles.overlay} onClick={onClose} aria-modal="true" role="dialog">
            <div
                className={styles.modal}
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>Settings</h2>
                    <button onClick={onClose} className={styles.closeButton} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Language</h3>
                    <div className={styles.row}>
                        <button
                            className={`${styles.optionButton} ${lang === 'en' ? styles.active : ''}`}
                            onClick={() => handleLangChange('en')}
                            disabled={lang === 'en'}
                        >
                            English
                        </button>
                        <button
                            className={`${styles.optionButton} ${lang === 'it' ? styles.active : ''}`}
                            onClick={() => handleLangChange('it')}
                            disabled={lang === 'it'}
                        >
                            Italiano
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Appearance</h3>
                    <div className={styles.row}>
                        <button
                            className={`${styles.optionButton} ${theme === 'light' ? styles.active : ''}`}
                            onClick={() => setTheme('light')}
                            disabled={theme === 'light'}
                        >
                            Light
                        </button>
                        <button
                            className={`${styles.optionButton} ${theme === 'dark' ? styles.active : ''}`}
                            onClick={() => setTheme('dark')}
                            disabled={theme === 'dark'}
                        >
                            Dark
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button
                            className={`${styles.optionButton} ${fontSize === 'normal' ? styles.active : ''}`}
                            onClick={() => setFontSize('normal')}
                            disabled={fontSize === 'normal'}
                        >
                            Normal
                        </button>
                        <button
                            className={`${styles.optionButton} ${fontSize === 'large' ? styles.active : ''}`}
                            onClick={() => setFontSize('large')}
                            disabled={fontSize === 'large'}
                        >
                            Big
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button
                            className={`${styles.optionButton} ${fontFamily === 'sans' ? styles.active : ''}`}
                            onClick={() => setFontFamily('sans')}
                            disabled={fontFamily === 'sans'}
                        >
                            Sans
                        </button>
                        <button
                            className={`${styles.optionButton} ${fontFamily === 'mono' ? styles.active : ''}`}
                            onClick={() => setFontFamily('mono')}
                            disabled={fontFamily === 'mono'}
                        >
                            Mono
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Download App</h3>
                    <AppLinks />
                </div>
            </div>
        </div>
    );
}
