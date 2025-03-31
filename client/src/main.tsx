import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ThemeToggle";

// Force apply theme based on local storage or system preference
const initializeTheme = () => {
  try {
    const root = window.document.documentElement;
    const storedTheme = localStorage.getItem("theme") || "system";
    
    // First remove any existing theme classes
    root.classList.remove("light", "dark");
    
    if (storedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      console.log(`Initialized with system theme: ${systemTheme}`);
    } else {
      root.classList.add(storedTheme);
      console.log(`Initialized with stored theme: ${storedTheme}`);
    }
  } catch (error) {
    console.error("Error initializing theme:", error);
    // Fallback to light theme
    document.documentElement.classList.add("light");
  }
};

// Run theme initialization before React renders
initializeTheme();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
