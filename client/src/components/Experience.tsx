import { motion } from "framer-motion";
import { Briefcase, Server } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Software Developer",
      company: "Cadence InfoTech",
      period: "February 2023 - Present",
      icon: <Briefcase />,
      points: [
        "Built responsive websites and applications using React.js and modern frameworks",
        "Optimized page load time by 40%, improving user experience",
        "Integrated API services and improved backend performance",
      ],
      align: "right",
    },
    {
      title: "System Administrator",
      company: "Nykaa.com",
      period: "February 2022 - November 2022",
      icon: <Server />,
      points: [
        "Managed IT infrastructure, security, and networks",
        "Automated monitoring and reduced system downtime by 35%",
      ],
      align: "left",
    },
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Work Experience</h2>
          <div className="h-1 w-20 mx-auto bg-primary rounded"></div>
        </div>
        
        <div className="relative">
          {/* Vertical line for timeline */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={index}
                className="relative flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Timeline badge */}
                <div className="hidden md:flex w-12 h-12 absolute left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-full items-center justify-center z-10 shadow-md">
                  {exp.icon}
                </div>
                
                {/* Timeline content */}
                <div 
                  className={`bg-card p-6 rounded-lg shadow mb-8 md:mb-0 md:w-5/12 relative ${
                    exp.align === "right" ? "md:ml-auto md:text-right" : ""
                  }`}
                >
                  <div className="text-sm text-muted-foreground mb-2">{exp.period}</div>
                  <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                  <h4 className="text-primary font-medium mb-3">{exp.company}</h4>
                  <ul className={`space-y-1 ${exp.align === "right" ? "md:list-inside" : "list-disc pl-5"}`}>
                    {exp.points.map((point, i) => (
                      <li key={i} className="text-muted-foreground">{point}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
