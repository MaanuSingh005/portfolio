import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  Github,
  Trash2,
  Edit,
  Plus,
  GripVertical,
  Eye,
  Save,
  FileCode,
  Tag,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Project schema for form validation
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  period: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  image: z.string().optional(),
  demoLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  codeLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  displayOrder: z.number().default(0),
  featured: z.boolean().default(false)
});

// Helper to create project schema including all optional fields
const createProjectSchema = projectSchema.extend({});
type ProjectFormValues = z.infer<typeof createProjectSchema>;

// Type representing a Project in the database
interface Project {
  id: number;
  title: string;
  displayOrder: number;
  period: string | null;
  description: string | null;
  technologies: string[];
  image: string | null;
  demoLink: string | null;
  codeLink: string | null;
  featured?: boolean;
}

export default function AdminProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [techInput, setTechInput] = useState("");
  const [isReordering, setIsReordering] = useState(false);
  const [projectOrder, setProjectOrder] = useState<number[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<"details" | "image">("details");
  
  // Form for adding/editing projects
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      period: "",
      technologies: [],
      image: "",
      demoLink: "",
      codeLink: "",
      displayOrder: 0,
      featured: false
    }
  });

  // Fetch projects
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      return await response.json();
    }
  });

  // Set up project order after projects are loaded
  useEffect(() => {
    if (projects && projects.length > 0) {
      const sortedProjects = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
      setProjectOrder(sortedProjects.map(project => project.id));
    }
  }, [projects]);

  // When editing, populate form with project data
  useEffect(() => {
    if (editingProject) {
      form.reset({
        title: editingProject.title,
        description: editingProject.description || "",
        period: editingProject.period || "",
        technologies: editingProject.technologies || [],
        image: editingProject.image || "",
        demoLink: editingProject.demoLink || "",
        codeLink: editingProject.codeLink || "",
        displayOrder: editingProject.displayOrder,
        featured: editingProject.featured || false
      });
      setImagePreview(editingProject.image);
    } else {
      form.reset({
        title: "",
        description: "",
        period: "",
        technologies: [],
        image: "",
        demoLink: "",
        codeLink: "",
        displayOrder: projects?.length || 0,
        featured: false
      });
      setImagePreview(null);
    }
  }, [editingProject, form, projects]);

  // Project mutations
  const addProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add project");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project added successfully",
      });
      setIsAddingProject(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add project",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProjectFormValues }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setEditingProject(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setDeletingProject(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
      });
    },
  });

  const reorderProjectsMutation = useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const response = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectIds: orderedIds }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to reorder projects");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Projects reordered successfully",
      });
      setIsReordering(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reorder projects",
      });
    },
  });

  // Form submission handlers
  const onSubmit = (data: ProjectFormValues) => {
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data });
    } else {
      addProjectMutation.mutate(data);
    }
  };

  // Technology management
  const addTechnology = () => {
    if (techInput.trim() && !form.getValues("technologies").includes(techInput.trim())) {
      const currentTech = form.getValues("technologies");
      form.setValue("technologies", [...currentTech, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    const currentTech = form.getValues("technologies");
    form.setValue("technologies", currentTech.filter(t => t !== tech));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  // Drag and drop reordering
  const handleDragStart = (id: number) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === id) return;
    
    const newOrder = [...projectOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(id);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
      setProjectOrder(newOrder);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const saveNewOrder = () => {
    // Map to new display orders and update
    if (projectOrder.length > 0) {
      reorderProjectsMutation.mutate(projectOrder);
    }
  };

  // Handle image upload
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For a real implementation, upload the file to a server/storage service
      // and get back a URL to store in the database
      // Here we're just creating a temporary object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      form.setValue("image", "uploads/" + file.name); // This would be the path after upload
    }
  };

  // Filter projects based on active tab
  const getFilteredProjects = () => {
    if (!projects) return [];
    
    switch (activeTab) {
      case "featured":
        return projects.filter((project: Project) => project.featured);
      default:
        return projects;
    }
  };

  // Sort projects by display order
  const getSortedProjects = () => {
    const filtered = getFilteredProjects();
    return isReordering
      ? filtered.sort((a: Project, b: Project) => projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id))
      : filtered.sort((a: Project, b: Project) => a.displayOrder - b.displayOrder);
  };

  const togglePreviewContent = () => {
    setPreviewContent(previewContent === "details" ? "image" : "details");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">
            Add, edit and showcase your portfolio projects
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "An error occurred while fetching projects"}
            </AlertDescription>
          </Alert>
        )}

        {/* Project Actions */}
        <div className="flex justify-between items-center">
          <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="featured">Featured Projects</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsReordering(!isReordering)}
              disabled={isLoading || !projects || projects.length < 2}
            >
              {isReordering ? "Cancel Reordering" : "Reorder Projects"}
            </Button>
            
            {isReordering && (
              <Button 
                onClick={saveNewOrder}
                disabled={reorderProjectsMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {reorderProjectsMutation.isPending ? "Saving..." : "Save Order"}
              </Button>
            )}
            
            <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Add a new project to your portfolio. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                
                <ProjectForm 
                  form={form} 
                  onSubmit={onSubmit} 
                  techInput={techInput}
                  setTechInput={setTechInput}
                  addTechnology={addTechnology}
                  removeTechnology={removeTechnology}
                  handleKeyDown={handleKeyDown}
                  imagePreview={imagePreview}
                  fileInputRef={fileInputRef}
                  handleImageSelection={handleImageSelection}
                  isSubmitting={addProjectMutation.isPending}
                  isEditing={false}
                  setImagePreview={setImagePreview}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Projects list */}
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>
              {isReordering 
                ? "Drag and drop projects to reorder them. Don't forget to save your changes." 
                : "Manage and organize your portfolio projects"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-3 w-[400px]" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : getSortedProjects().length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground">No projects found. Start by adding your first project.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddingProject(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Project
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isReordering && <TableHead className="w-[50px]"></TableHead>}
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead className="hidden md:table-cell">Technologies</TableHead>
                      <TableHead className="w-[100px] hidden md:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedProjects().map((project: Project) => (
                      <TableRow 
                        key={project.id} 
                        className={isReordering ? "cursor-move" : ""}
                        draggable={isReordering}
                        onDragStart={isReordering ? () => handleDragStart(project.id) : undefined}
                        onDragOver={isReordering ? (e) => handleDragOver(e, project.id) : undefined}
                        onDragEnd={isReordering ? handleDragEnd : undefined}
                        data-project-id={project.id}
                      >
                        {isReordering && (
                          <TableCell>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {project.image ? (
                              <div 
                                className="w-8 h-8 mr-2 bg-cover bg-center rounded border"
                                style={{ backgroundImage: `url(${project.image})` }}
                              ></div>
                            ) : (
                              <div className="w-8 h-8 mr-2 bg-muted rounded border flex items-center justify-center">
                                <FileCode className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <div>{project.title}</div>
                              {project.period && (
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" /> {project.period}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies && project.technologies.length > 0 ? (
                              project.technologies.slice(0, 3).map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">No technologies listed</span>
                            )}
                            {project.technologies && project.technologies.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.technologies.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {project.featured && (
                            <Badge>Featured</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewingProject(project)}
                              title="View Project Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingProject(project)}
                              title="Edit Project"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingProject(project)}
                              title="Delete Project"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update the details of your project.
              </DialogDescription>
            </DialogHeader>
            
            <ProjectForm 
              form={form} 
              onSubmit={onSubmit} 
              techInput={techInput}
              setTechInput={setTechInput}
              addTechnology={addTechnology}
              removeTechnology={removeTechnology}
              handleKeyDown={handleKeyDown}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleImageSelection={handleImageSelection}
              isSubmitting={updateProjectMutation.isPending}
              isEditing={true}
              setImagePreview={setImagePreview}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Project Dialog */}
      {viewingProject && (
        <Dialog open={!!viewingProject} onOpenChange={(open) => !open && setViewingProject(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingProject.title}</DialogTitle>
              <DialogDescription>
                {viewingProject.period && (
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{viewingProject.period}</span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`space-y-4 ${previewContent === 'image' ? 'md:col-span-2' : ''}`}>
                {previewContent === "details" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <div className="text-sm text-muted-foreground">
                        {viewingProject.description || "No description provided"}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Technologies</h3>
                      {viewingProject.technologies && viewingProject.technologies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {viewingProject.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No technologies listed</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {viewingProject.demoLink && (
                        <a 
                          href={viewingProject.demoLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      )}
                      
                      {viewingProject.codeLink && (
                        <a 
                          href={viewingProject.codeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          View Code
                        </a>
                      )}
                    </div>
                  </>
                )}
                
                {previewContent === "image" && viewingProject.image && (
                  <div className="mt-4">
                    <img 
                      src={viewingProject.image} 
                      alt={viewingProject.title} 
                      className="max-h-[70vh] w-full object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              {previewContent === "details" && (
                <div className="flex justify-center items-start">
                  {viewingProject.image ? (
                    <img 
                      src={viewingProject.image} 
                      alt={viewingProject.title} 
                      className="max-h-[300px] object-contain rounded-lg border"
                    />
                  ) : (
                    <div className="w-full h-[200px] bg-muted rounded-lg border flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <span className="text-muted-foreground ml-2">No image available</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button 
                variant="outline" 
                onClick={togglePreviewContent}
                className="sm:ml-0 mt-2 sm:mt-0"
              >
                {previewContent === "details" ? "Show Full Image" : "Show Details"}
              </Button>
              
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setViewingProject(null);
                    setEditingProject(viewingProject);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={() => setViewingProject(null)}>
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Project Confirmation */}
      {deletingProject && (
        <Dialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deletingProject.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingProject(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteProjectMutation.mutate(deletingProject.id)}
                disabled={deleteProjectMutation.isPending}
              >
                {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}

// Project Form Component
interface ProjectFormProps {
  form: any;
  onSubmit: (values: ProjectFormValues) => void;
  techInput: string;
  setTechInput: (value: string) => void;
  addTechnology: () => void;
  removeTechnology: (tech: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isEditing: boolean;
  setImagePreview?: (value: string | null) => void;
}

const ProjectForm = ({
  form,
  onSubmit,
  techInput,
  setTechInput,
  addTechnology,
  removeTechnology,
  handleKeyDown,
  imagePreview,
  fileInputRef,
  handleImageSelection,
  isSubmitting,
  isEditing,
  setImagePreview
}: ProjectFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E-commerce Platform, Portfolio Website, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Period</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Jan 2023 - Mar 2023, Summer 2024, etc." 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    When you worked on this project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project, its purpose, and your role..." 
                      className="min-h-[120px]" 
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Technologies Used</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add technology (e.g., React, Node.js)"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  type="button" 
                  onClick={addTechnology} 
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("technologies")?.map((tech: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => removeTechnology(tech)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {form.watch("technologies")?.length === 0 && (
                  <span className="text-xs text-muted-foreground">No technologies added yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Project Image</FormLabel>
              <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img 
                      src={imagePreview} 
                      alt="Project preview" 
                      className="mx-auto max-h-[200px] object-contain rounded"
                    />
                    <div className="flex justify-center space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        Change Image
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (setImagePreview) setImagePreview(null);
                          form.setValue("image", "");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="py-8 cursor-pointer"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or GIF (Max 2MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelection}
                />
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="demoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Demo URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to a live demo of your project (if available)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Repository URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://github.com/username/project" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to the source code (like GitHub, GitLab, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Featured Project</FormLabel>
                    <FormDescription>
                      Highlight this as a featured project on your portfolio
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? isEditing ? "Updating..." : "Adding..." 
              : isEditing ? "Update Project" : "Add Project"
            }
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};