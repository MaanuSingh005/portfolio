import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Import the actual photos
import photo1 from "../assets/photos/photo_2025-03-31_13-15-54.jpg";
import photo2 from "../assets/photos/photo_2025-03-31_13-15-56.jpg";
import photo3 from "../assets/photos/photo_2025-03-31_13-15-58.jpg";
import photo4 from "../assets/photos/photo_2025-03-31_13-15-59.jpg";
import photo5 from "../assets/photos/photo_2025-03-31_14-11-05.jpg";

interface ImageSlideshowProps {
  autoplay?: boolean;
  interval?: number;
  className?: string;
  rounded?: boolean;
}

const ImageSlideshow = ({ 
  autoplay = true, 
  interval: intervalProp = 5000,
  className = "",
  rounded = true
}: ImageSlideshowProps) => {
  const images = [photo1, photo2, photo3, photo4, photo5];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);
  
  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);
  
  useEffect(() => {
    if (!autoplay) return;
    
    const intervalId = setInterval(() => {
      goToNext();
    }, intervalProp);
    
    return () => clearInterval(intervalId);
  }, [autoplay, intervalProp, goToNext]);
  
  return (
    <div className={`relative overflow-hidden ${rounded ? 'rounded-2xl' : ''} ${className}`}>
      <div className="aspect-video relative"> {/* Changed from aspect-square to aspect-video */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Profile image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-between p-2"> {/* Reduced padding */}
        <button 
          onClick={goToPrev}
          className="w-8 h-8 rounded-full bg-background/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" /> {/* Smaller icon */}
        </button>
        
        <button 
          onClick={goToNext}
          className="w-8 h-8 rounded-full bg-background/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" /> {/* Smaller icon */}
        </button>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5"> {/* Smaller indicators */}
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full ${
              index === currentIndex 
                ? "bg-primary w-3 transition-all duration-300" 
                : "bg-white/50 w-1.5"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;