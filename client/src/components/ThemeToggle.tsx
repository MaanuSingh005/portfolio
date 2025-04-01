import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      try {
        return (localStorage.getItem("theme") as Theme) || "system";
      } catch {
        return "system";
      }
    }
  );

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      
      // First remove any existing theme classes
      root.classList.remove("light", "dark");
      
      if (theme === "system") {
        // Check system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        
        // Apply system theme
        root.classList.add(systemTheme);
        console.log(`Applied system theme: ${systemTheme}`);
      } else {
        // Apply explicitly selected theme
        root.classList.add(theme);
        console.log(`Applied user theme: ${theme}`);
      }
      
      // Store user preference
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeToggle() {
  // Getting theme context directly from the context
  const context = useContext(ThemeContext);
  
  // Get the actual theme (light or dark) based on the system preference or current setting
  const getActualTheme = (): "light" | "dark" => {
    if (!context) return "light";
    
    if (context.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    return context.theme;
  };
  
  // The current actual theme (light or dark)
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");
  
  // Update the actual theme when the context theme changes
  useEffect(() => {
    if (context) {
      setActualTheme(getActualTheme());
    }
  }, [context?.theme]);
  
  // Also listen for system theme changes if using system theme
  useEffect(() => {
    if (!context) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (context.theme === "system") {
        setActualTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [context]);
  
  if (!context) {
    // Fallback to a non-functional button if context is missing
    // This prevents the app from crashing
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-muted/50"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Theme toggle (disabled)</span>
      </Button>
    );
  }
  
  const { theme, setTheme } = context;
  
  const toggleTheme = () => {
    // Get the current theme
    const currentTheme = theme === 'system' 
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme;
    
    // Toggle to the opposite theme
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    console.log(`Toggling from ${currentTheme} to ${newTheme}`);
    
    // Update theme in context - this will trigger the useEffect in ThemeProvider
    // which handles the actual DOM updates
    setTheme(newTheme);
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="bg-muted/50"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
