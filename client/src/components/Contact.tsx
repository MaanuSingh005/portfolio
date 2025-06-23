import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaStackOverflow } from "react-icons/fa";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Location",
      info: "Dwarka Sec-25, New Delhi",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      info: "Maanu6586@gmail.com",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      info: "+91 7703805081",
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="h-5 w-5" />,
      url: "https://github.com/MaanuSingh005",
    },
    {
      icon: <FaLinkedinIn className="h-5 w-5" />,
      url: "https://www.linkedin.com/in/kamaljeet05/",
    },
    {
      icon: <FaStackOverflow className="h-5 w-5" />,
      url: "https://stackoverflow.com/users/16972252/kamal-jeet-singh",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formValues.name || !formValues.email || !formValues.message) {
    toast({
      title: "Error",
      description: "Please fill out all required fields",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    // 1. Send to you (admin)
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID!,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID!, // template_mvsz0t2
      {
        name: formValues.name,
        from_email: formValues.email,
        subject: formValues.subject,
        message: formValues.message,
        time: new Date().toLocaleString(),
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    // 2. Auto-reply to user
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID!,
      import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID!, 
      {
        name: formValues.name,
        email: formValues.email, 
        subject: formValues.subject,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    toast({
      title: "Success!",
      description: "Your message has been sent.",
    });

    setFormValues({ name: "", email: "", subject: "", message: "" });
  } catch (error: any) {
    toast({
      title: "Error",
      description: "Failed to send message. Please try again later.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Basic validation
  //   if (!formValues.name || !formValues.email || !formValues.message) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill out all required fields",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   // Email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(formValues.email)) {
  //     toast({
  //       title: "Error",
  //       description: "Please enter a valid email address",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     await apiRequest("POST", "/api/contact", formValues);

  //     toast({
  //       title: "Success!",
  //       description: "Your message has been sent. I'll get back to you soon!",
  //     });

  //     // Reset form
  //     setFormValues({
  //       name: "",
  //       email: "",
  //       subject: "",
  //       message: "",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to send message. Please try again later.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
          <div className="h-1 w-20 mx-auto bg-primary rounded"></div>
          <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
            Feel free to reach out if you want to collaborate, have a question,
            or just want to connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-border hover:border-primary hover:text-primary hover:bg-primary/10 transition-all text-xl"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-6">
                {/* <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formValues.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formValues.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form> */}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formValues.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formValues.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
