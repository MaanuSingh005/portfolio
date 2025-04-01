import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import OpenSource from "./components/OpenSource";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminSkills from "./pages/AdminSkills";
import NotFound from "./pages/not-found";

// Portfolio homepage component
const Portfolio = () => {
  // Smooth scroll to section when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80,
            behavior: "smooth",
          });
        }
      }
    };

    // Initial scroll if hash exists
    if (window.location.hash) {
      setTimeout(handleHashChange, 100);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Home />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <OpenSource />
        <Contact />
      </motion.main>
      <Footer />
    </div>
  );
};

function App() {
  const [location] = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        {/* Admin routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/skills" component={AdminSkills} />
        <Route path="/admin" component={Admin} />
        
        {/* Portfolio route */}
        <Route path="/" component={Portfolio} />
        
        {/* 404 route */}
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
