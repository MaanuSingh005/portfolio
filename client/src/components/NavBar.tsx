import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow when scrolled
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Highlight active section
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleMobileNavClick = () => {
    setIsOpen(false);
  };
  
  const navLinks = [
    { href: "#home", text: "Home" },
    { href: "#about", text: "About" },
    { href: "#experience", text: "Experience" },
    { href: "#education", text: "Education" },
    { href: "#projects", text: "Projects" },
    { href: "#skills", text: "Skills" },
    { href: "#contact", text: "Contact" },
  ];
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href="#home" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">KJ</span>
            <span className="hidden sm:inline-block font-semibold">Kamal Jeet</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className={`font-medium transition-colors ${activeSection === link.href.substring(1) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {link.text}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Admin Login Button */}
            <a 
              href="/auth" 
              className="hidden md:flex items-center gap-1 px-3 py-2 text-sm bg-primary/10 rounded hover:bg-primary/20 text-primary"
              title="Admin Login"
            >
              <LogIn className="h-4 w-4" />
              <span>Admin</span>
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className={`py-2 font-medium transition-colors ${activeSection === link.href.substring(1) ? "text-primary" : "text-muted-foreground"}`}
                  onClick={handleMobileNavClick}
                >
                  {link.text}
                </a>
              ))}
              
              {/* Admin Login for Mobile */}
              <a 
                href="/auth" 
                onClick={handleMobileNavClick}
                className="flex items-center gap-1 mt-2 px-3 py-2 bg-primary/10 rounded hover:bg-primary/20 text-primary"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
