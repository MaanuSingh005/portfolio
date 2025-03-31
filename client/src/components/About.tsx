import { motion } from "framer-motion";
import { Code, Server, Plug, Cog, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImageSlideshow from "./ImageSlideshow";
import cvPdfPath from "../assets/kamal-jeet-cv.pdf";

const About = () => {
  const expertiseItems = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Frontend",
      description: "React.js, Next.js, React Native, Angular",
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "Backend",
      description: "Node.js, Firebase, MySQL, MongoDB",
    },
    {
      icon: <Plug className="h-8 w-8" />,
      title: "APIs",
      description: "RESTful APIs, API integration",
    },
    {
      icon: <Cog className="h-8 w-8" />,
      title: "DevOps",
      description: "Git, CI/CD pipelines, Docker, GitHub Actions",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">About Me</h2>
          <div className="h-1 w-20 mx-auto bg-primary rounded"></div>
        </div>
        
        {/* Photo Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg">
            <ImageSlideshow 
              interval={4000} 
              className="w-full" 
              rounded={false} 
            />
          </div>
          <div className="max-w-xl mx-auto">
            <p className="text-center mt-4 text-muted-foreground italic">
              "Passionate about turning ideas into elegant code and solving real-world problems"
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-primary">My Journey</h3>
            <p className="mb-4">
              With 2 years of experience in web application development, I've honed my skills in building responsive, 
              performant, and user-friendly applications. I'm passionate about clean code, modern development practices, 
              and continuously learning new technologies.
            </p>
            <p className="mb-6">
              My background in system administration has given me valuable insights into infrastructure, security, 
              and deployment processes that complement my development skills.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Problem-solving</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Clean code enthusiast</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Continuous learner</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Team collaborator</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a href="#contact" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-white shadow hover:bg-primary/90 transition-colors">
                  Let's work together
                </a>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href={cvPdfPath} download="kamal-jeet-cv.pdf">
                    <Download size={16} className="mr-1" />
                    Resume
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {expertiseItems.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="pt-6">
                    <div className="text-primary mb-4">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
