import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Github, Linkedin, ExternalLink } from "lucide-react";
import { FaStackOverflow } from "react-icons/fa";

const Home = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block">Hi, I'm</span>
              <span className="text-primary">Kamal Jeet</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-muted-foreground">Software Developer</h2>
            <p className="text-lg mb-8 max-w-lg text-muted-foreground">
              Building modern web experiences with React.js and cutting-edge technologies. 
              Passionate about creating innovative, user-friendly applications that solve real-world problems.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                  <Phone size={16} />
                </div>
                <span>+91 7703805081</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                  <Mail size={16} />
                </div>
                <span>Maanu6586@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                  <MapPin size={16} />
                </div>
                <span>Dwarka Sec-25, New Delhi</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="#contact">Get in touch</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#projects">View projects</a>
              </Button>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <a 
                href="https://github.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:border-primary hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:border-primary hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://stackoverflow.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:border-primary hover:text-primary hover:bg-primary/10 transition-all"
              >
                <FaStackOverflow size={18} />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-full blur opacity-30 animate-pulse-slow"></div>
              <div className="relative rounded-full overflow-hidden border-4 border-background w-64 h-64 md:w-80 md:h-80 shadow-lg">
                <svg 
                  className="w-full h-full text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;
