import { motion } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Server, Cog, Users } from "lucide-react";
import { 
  SiJira, 
  SiSlack, 
  SiPostman, 
  SiSwagger, 
  SiDocker, 
  SiGithub 
} from "react-icons/si";
import { Progress } from "@/components/ui/progress";
import { skills as skillsData } from "@/lib/data";

interface SkillCategory {
  name: string;
  icon: JSX.Element;
  skills: {
    name: string;
    proficiency: number;
  }[];
}

const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Define the skill categories with icons
  const skillCategories: SkillCategory[] = [
    {
      name: "Frontend",
      icon: <Code className="h-6 w-6" />,
      skills: skillsData.frontend.map(skill => ({ 
        name: skill.name, 
        proficiency: skill.level 
      })),
    },
    {
      name: "Backend",
      icon: <Server className="h-6 w-6" />,
      skills: skillsData.backend.map(skill => ({ 
        name: skill.name, 
        proficiency: skill.level 
      })),
    },
    {
      name: "DevOps",
      icon: <Cog className="h-6 w-6" />,
      skills: skillsData.devops.map(skill => ({ 
        name: skill.name, 
        proficiency: skill.level 
      })),
    },
    {
      name: "Soft Skills",
      icon: <Users className="h-6 w-6" />,
      skills: skillsData.softSkills.map(skill => ({ 
        name: skill.name, 
        proficiency: skill.level 
      })),
    },
  ];

  const tools = [
    { name: "Jira", icon: <SiJira className="h-6 w-6" /> },
    { name: "Slack", icon: <SiSlack className="h-6 w-6" /> },
    { name: "Postman", icon: <SiPostman className="h-6 w-6" /> },
    { name: "Swagger", icon: <SiSwagger className="h-6 w-6" /> },
    { name: "Docker", icon: <SiDocker className="h-6 w-6" /> },
    { name: "GitHub", icon: <SiGithub className="h-6 w-6" /> },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.5 
      },
    },
  };

  // Progress bar animation variants
  const progressVariants = {
    hidden: { width: 0 },
    visible: (custom: number) => ({
      width: `${custom}%`,
      transition: { 
        duration: 1.2,
        ease: "easeOut",
        delay: 0.3
      }
    })
  };

  return (
    <section id="skills" className="py-20" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-2">Skills</h2>
          <div className="h-1 w-20 mx-auto bg-primary rounded"></div>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and professional capabilities.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skillCategories.map((category, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Card className="h-full overflow-hidden border-t-4 border-primary shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="text-primary bg-primary/10 p-2 rounded-md">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div 
                        key={skillIndex} 
                        className="space-y-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.1 * skillIndex }}
                        viewport={{ once: true }}
                      >
                        <div className="flex justify-between text-sm font-medium">
                          <span>{skill.name}</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            custom={skill.proficiency}
                            variants={progressVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Tools */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Tools & Platforms</h3>
          <motion.div 
            className="flex flex-wrap justify-center gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tools.map((tool, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center justify-center w-28 h-28 bg-card rounded-xl shadow-md p-4 border border-border"
              >
                <div className="text-primary mb-3">{tool.icon}</div>
                <span className="font-medium text-sm">{tool.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
