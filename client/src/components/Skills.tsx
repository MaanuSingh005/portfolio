import { motion } from "framer-motion";
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

interface SkillCategory {
  name: string;
  icon: JSX.Element;
  skills: {
    name: string;
    proficiency: number;
  }[];
}

const Skills = () => {
  const skillCategories: SkillCategory[] = [
    {
      name: "Frontend",
      icon: <Code className="h-6 w-6" />,
      skills: [
        { name: "React.js", proficiency: 90 },
        { name: "Next.js", proficiency: 85 },
        { name: "React Native", proficiency: 80 },
        { name: "Angular", proficiency: 70 },
        { name: "TailwindCSS", proficiency: 85 },
      ],
    },
    {
      name: "Backend",
      icon: <Server className="h-6 w-6" />,
      skills: [
        { name: "Node.js", proficiency: 85 },
        { name: "Firebase", proficiency: 80 },
        { name: "MongoDB", proficiency: 75 },
        { name: "MySQL", proficiency: 70 },
      ],
    },
    {
      name: "DevOps",
      icon: <Cog className="h-6 w-6" />,
      skills: [
        { name: "Git", proficiency: 90 },
        { name: "CI/CD", proficiency: 80 },
        { name: "GitHub Actions", proficiency: 75 },
        { name: "Jenkins", proficiency: 65 },
      ],
    },
    {
      name: "Soft Skills",
      icon: <Users className="h-6 w-6" />,
      skills: [
        { name: "Problem-Solving", proficiency: 95 },
        { name: "Communication", proficiency: 85 },
        { name: "Collaboration", proficiency: 90 },
        { name: "Adaptability", proficiency: 85 },
      ],
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
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Skills</h2>
          <div className="h-1 w-20 mx-auto bg-primary rounded"></div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillCategories.map((category, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-primary">{category.icon}</div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <Progress value={skill.proficiency} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Tools */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6 text-center">Tools & Platforms</h3>
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tools.map((tool, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center justify-center w-24 h-24 bg-card rounded-lg shadow p-4"
              >
                <div className="text-primary mb-2">{tool.icon}</div>
                <span>{tool.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
