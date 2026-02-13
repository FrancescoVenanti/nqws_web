"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type FontSize = "normal" | "large";
export type FontFamily = "sans" | "mono";

interface AppearanceContextType {
    theme: Theme;
    fontSize: FontSize;
    fontFamily: FontFamily;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    toggleFontSize: () => void;
    setFontSize: (size: FontSize) => void;
    toggleFontFamily: () => void;
    setFontFamily: (font: FontFamily) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [fontSize, setFontSize] = useState<FontSize>("normal");
    const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from localStorage
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        const storedSize = localStorage.getItem("fontSize") as FontSize | null;
        const storedFont = localStorage.getItem("fontFamily") as FontFamily | null;

        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute("data-theme", storedTheme);
        } else {
            const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            setTheme(sysTheme);
            document.documentElement.setAttribute("data-theme", sysTheme);
        }

        if (storedSize) {
            setFontSize(storedSize);
            document.documentElement.setAttribute("data-font-size", storedSize);
        }

        if (storedFont) {
            setFontFamily(storedFont);
            document.documentElement.setAttribute("data-font-family", storedFont);
        }

        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setThemeState(newTheme);
    };

    const setThemeState = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const toggleFontSize = () => {
        const newSize = fontSize === "normal" ? "large" : "normal";
        setFontSizeState(newSize);
    };

    const setFontSizeState = (newSize: FontSize) => {
        setFontSize(newSize);
        localStorage.setItem("fontSize", newSize);
        document.documentElement.setAttribute("data-font-size", newSize);
    };

    const toggleFontFamily = () => {
        const newFont = fontFamily === "sans" ? "mono" : "sans";
        setFontFamilyState(newFont);
    };

    const setFontFamilyState = (newFont: FontFamily) => {
        setFontFamily(newFont);
        localStorage.setItem("fontFamily", newFont);
        document.documentElement.setAttribute("data-font-family", newFont);
    };

    return (
        <AppearanceContext.Provider
            value={{
                theme,
                fontSize,
                fontFamily,
                toggleTheme,
                setTheme: setThemeState,
                toggleFontSize,
                setFontSize: setFontSizeState,
                toggleFontFamily,
                setFontFamily: setFontFamilyState,
            }}
        >
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            (function() {
              try {
                var storedTheme = localStorage.getItem('theme');
                var theme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);

                var storedSize = localStorage.getItem('fontSize');
                if (storedSize) document.documentElement.setAttribute('data-font-size', storedSize);

                var storedFont = localStorage.getItem('fontFamily');
                if (storedFont) document.documentElement.setAttribute('data-font-family', storedFont);
              } catch (e) {}
            })();
          `,
                }}
            />
            {children}
        </AppearanceContext.Provider>
    );
}

export function useAppearance() {
    const context = useContext(AppearanceContext);
    if (context === undefined) {
        throw new Error("useAppearance must be used within a AppearanceProvider");
    }
    return context;
}
