import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
  title: string;
  period: string;
  description: string;
  technologies: string[];
  image: string;
}

const Projects = () => {
  const projects: Project[] = [
    {
      title: "CRC-WB App",
      period: "11/2023 - Present",
      description: "A Clinical Research Center app for doctors, providing essential resources.",
      technologies: ["React Native", "API Integration", "Workflow Automation"],
      image: "crc-wb-app",
    },
    {
      title: "CRC Web Admin Portal",
      period: "05/2023 - 10/2023",
      description: "Admin panel for content management using React.js.",
      technologies: ["React.js", "API Integration", "Admin Dashboard"],
      image: "crc-web-admin",
    },
    {
      title: "Apeejay Education App",
      period: "09/2023 - 05/2024",
      description: "An education platform for students and teachers.",
      technologies: ["React.js", "Moodle", "DataLake"],
      image: "apeejay-education-app",
    },
    {
      title: "Smart Workflow App",
      period: "04/2023 - 08/2023",
      description: "A task management system for workflow automation.",
      technologies: ["Adalo", "Zapier", "Task Management"],
      image: "smart-workflow-app",
    },
  ];

  // Create SVG illustrations for each project
  const getProjectSvg = (name: string) => {
    const colors = ['#6366f1', '#0ea5e9', '#8b5cf6', '#f43f5e'];
    const index = projects.findIndex(p => p.image === name);
    const color = colors[index % colors.length];
    
    // Generic abstract SVG representations for each project
    const svgMap: Record<string, JSX.Element> = {
      "crc-wb-app": (
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <rect x="40" y="20" width="120" height="110" rx="10" fill={color} opacity="0.2" />
          <rect x="55" y="40" width="90" height="60" rx="5" fill={color} opacity="0.6" />
          <circle cx="100" cy="120" r="8" fill={color} />
        </svg>
      ),
      "crc-web-admin": (
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <rect x="30" y="30" width="140" height="90" rx="5" fill={color} opacity="0.2" />
          <rect x="45" y="50" width="30" height="60" rx="2" fill={color} opacity="0.6" />
          <rect x="85" y="50" width="70" height="60" rx="2" fill={color} opacity="0.4" />
        </svg>
      ),
      "apeejay-education-app": (
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <path d="M40,30 h120 a10,10 0 0 1 10,10 v80 a10,10 0 0 1 -10,10 h-120 a10,10 0 0 1 -10,-10 v-80 a10,10 0 0 1 10,-10 z" fill={color} opacity="0.2" />
          <circle cx="70" cy="60" r="15" fill={color} opacity="0.6" />
          <rect x="95" y="50" width="60" height="10" rx="2" fill={color} opacity="0.4" />
          <rect x="95" y="70" width="40" height="10" rx="2" fill={color} opacity="0.4" />
          <rect x="50" y="90" width="100" height="20" rx="2" fill={color} opacity="0.3" />
        </svg>
      ),
      "smart-workflow-app": (
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <circle cx="50" cy="50" r="20" fill={color} opacity="0.6" />
          <circle cx="150" cy="50" r="20" fill={color} opacity="0.6" />
          <circle cx="50" cy="100" r="20" fill={color} opacity="0.6" />
          <circle cx="150" cy="100" r="20" fill={color} opacity="0.6" />
          <line x1="70" y1="50" x2="130" y2="50" stroke={color} strokeWidth="3" />
          <line x1="70" y1="100" x2="130" y2="100" stroke={color} strokeWidth="3" />
          <line x1="50" y1="70" x2="50" y2="80" stroke={color} strokeWidth="3" />
          <line x1="150" y1="70" x2="150" y2="80" stroke={color} strokeWidth="3" />
        </svg>
      ),
    };
    
    return svgMap[name] || (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <rect x="40" y="30" width="120" height="90" rx="5" fill={color} opacity="0.3" />
      </svg>
    );
  };

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
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">My Projects</h2>
          <div className="h-1 w-20 mx-auto bg-primary rounded"></div>
          <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
            Here are some of the projects I've worked on. Each project has been an opportunity to learn and grow as a developer.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="overflow-hidden h-full group">
                <div className="h-56 relative overflow-hidden bg-muted">
                  {getProjectSvg(project.image)}
                  
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <Eye size={18} />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <Code size={18} />
                      </a>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <span className="text-sm text-muted-foreground">{project.period}</span>
                  </div>
                  <p className="mb-4 text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
