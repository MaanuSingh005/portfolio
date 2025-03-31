import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FaReact, 
  FaStackOverflow, 
  FaGithub 
} from "react-icons/fa";

interface Contribution {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const OpenSource = () => {
  const contributions: Contribution[] = [
    {
      icon: <FaReact className="h-6 w-6" />,
      title: "React.js UI Libraries",
      description: "Contributed to popular React component libraries, fixing bugs and adding new features to improve developer experience.",
      link: "#",
      linkText: "View Contributions",
    },
    {
      icon: <FaStackOverflow className="h-6 w-6" />,
      title: "Stack Overflow",
      description: "Actively answer questions related to React, Node.js, and modern web development to help fellow developers.",
      link: "#",
      linkText: "View Profile",
    },
    {
      icon: <FaGithub className="h-6 w-6" />,
      title: "GitHub Repositories",
      description: "Maintain several open-source repositories with utilities, starter templates, and learning resources for web developers.",
      link: "#",
      linkText: "View Repositories",
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
    <section id="open-source" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Open Source</h2>
          <div className="h-1 w-20 mx-auto bg-primary rounded"></div>
          <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
            I actively contribute to open-source projects and believe in giving back to the community.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {contributions.map((contribution, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-primary text-3xl">{contribution.icon}</div>
                    <h3 className="text-xl font-semibold">{contribution.title}</h3>
                  </div>
                  <p className="mb-4 text-muted-foreground">{contribution.description}</p>
                  <a 
                    href={contribution.link} 
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
                  >
                    {contribution.linkText}
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              <FaGithub className="mr-2" />
              View My GitHub Profile
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
