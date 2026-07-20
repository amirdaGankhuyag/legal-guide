import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// index.css дотор @custom-variant dark (&:where(.dark, .dark *)); гэж
// тодорхойлогдсон тул <html> элемент дээр "dark" класс байхад л
// Tailwind-ийн бүх dark: prefix-тэй style идэвхжинэ.
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    // Хадгалсан сонголт байхгүй бол системийн тохиргоог дагана
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
