import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, BookOpen, MapPin, Calendar } from "lucide-react";
import { education } from "@/lib/data";

const Education: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="education" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Education</h2>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-1 rounded-full bg-primary"></div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My academic journey that has shaped my technical foundation and knowledge in computer science and software development.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 max-w-4xl mx-auto"
        >
          {education.map((edu) => (
            <motion.div key={edu.id} variants={itemVariants}>
              <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-xl font-bold text-primary">{edu.degree}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <BookOpen size={16} className="mr-2" />
                        {edu.institution}
                      </CardDescription>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin size={14} className="mr-1" /> 
                        {edu.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={14} className="mr-1" /> 
                        {edu.period}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-muted-foreground">{edu.description}</p>
                  
                  {edu.courses && edu.courses.length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold mb-2">Key Courses</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {edu.courses.map((course, idx) => (
                          <Badge key={idx} variant="outline" className="font-normal">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {edu.achievements && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex items-start mt-2">
                        <GraduationCap className="text-primary mr-2 mt-0.5" size={16} />
                        <p className="text-sm">
                          <span className="font-semibold">Achievement:</span> {edu.achievements}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Education;