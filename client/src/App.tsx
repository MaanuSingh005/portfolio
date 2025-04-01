import { useEffect } from "react";
import { Route, Switch } from "wouter";
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
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Admin pages
import Admin from "./pages/Admin";
import AdminSkills from "./pages/AdminSkills";
import AdminProjects from "./pages/AdminProjects";
import AdminTheme from "./pages/AdminTheme";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";

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

// App component implementation

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          {/* Admin routes */}
          <ProtectedRoute path="/admin/projects" component={AdminProjects} />
          <ProtectedRoute path="/admin/skills" component={AdminSkills} />
          <ProtectedRoute path="/admin/theme" component={AdminTheme} />
          <ProtectedRoute path="/admin" component={Admin} />
          
          {/* Admin login route */}
          <Route path="/admin/login" component={AdminLogin} />
          
          {/* Auth page */}
          <Route path="/auth" component={AuthPage} />
          
          {/* Portfolio route */}
          <Route path="/" component={Portfolio} />
          
          {/* 404 route */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
