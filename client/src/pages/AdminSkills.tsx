import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Plus, Trash, Edit, BarChart, FolderTree } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schemas for form validation
const skillCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  icon: z.string().min(1, "Icon is required"),
  displayOrder: z.coerce.number().int().min(0),
});

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.coerce.number().int().min(1).max(100),
  categoryId: z.coerce.number().int().min(1, "Category is required"),
});

type SkillCategory = {
  id: number;
  name: string;
  icon: string;
  displayOrder: number;
};

type Skill = {
  id: number;
  name: string;
  level: number;
  categoryId: number;
};

export default function AdminSkills() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("skills");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<SkillCategory | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);

  // Fetch skill categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ["/api/skill-categories"],
    queryFn: async () => {
      const response = await fetch("/api/skill-categories");
      if (!response.ok) {
        throw new Error("Failed to fetch skill categories");
      }
      return await response.json();
    }
  });

  // Fetch skills
  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError
  } = useQuery({
    queryKey: ["/api/skills"],
    queryFn: async () => {
      const response = await fetch("/api/skills");
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }
      return await response.json();
    }
  });

  // Form for adding/editing skill categories
  const categoryForm = useForm<z.infer<typeof skillCategorySchema>>({
    resolver: zodResolver(skillCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      displayOrder: 0,
    },
  });

  // Form for adding/editing skills
  const skillForm = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      level: 50,
      categoryId: 0,
    },
  });

  // Mutations for categories
  const addCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof skillCategorySchema>) => {
      const response = await fetch("/api/skill-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skill-categories"] });
      toast({
        title: "Success",
        description: "Skill category added successfully",
      });
      setIsAddingCategory(false);
      categoryForm.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof skillCategorySchema> }) => {
      const response = await fetch(`/api/skill-categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skill-categories"] });
      toast({
        title: "Success",
        description: "Skill category updated successfully",
      });
      setEditingCategory(null);
      categoryForm.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/skill-categories/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skill-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Success",
        description: "Skill category deleted successfully",
      });
      setDeletingCategory(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
      });
    },
  });

  // Mutations for skills
  const addSkillMutation = useMutation({
    mutationFn: async (data: z.infer<typeof skillSchema>) => {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add skill");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
      setIsAddingSkill(false);
      skillForm.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add skill",
      });
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof skillSchema> }) => {
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update skill");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });
      setEditingSkill(null);
      skillForm.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update skill",
      });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
      setDeletingSkill(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete skill",
      });
    },
  });

  // Form submission handlers
  const onAddCategory = (data: z.infer<typeof skillCategorySchema>) => {
    addCategoryMutation.mutate(data);
  };

  const onEditCategory = (data: z.infer<typeof skillCategorySchema>) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    }
  };

  const onAddSkill = (data: z.infer<typeof skillSchema>) => {
    addSkillMutation.mutate(data);
  };

  const onEditSkill = (data: z.infer<typeof skillSchema>) => {
    if (editingSkill) {
      updateSkillMutation.mutate({ id: editingSkill.id, data });
    }
  };

  const handleEditCategory = (category: SkillCategory) => {
    categoryForm.reset({
      name: category.name,
      icon: category.icon,
      displayOrder: category.displayOrder,
    });
    setEditingCategory(category);
  };

  const handleEditSkill = (skill: Skill) => {
    skillForm.reset({
      name: skill.name,
      level: skill.level,
      categoryId: skill.categoryId,
    });
    setEditingSkill(skill);
  };

  // Get skill category name by ID
  const getCategoryName = (categoryId: number) => {
    if (categoriesLoading || !categories) return "Loading...";
    const category = categories.find((cat: SkillCategory) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Helper function to get skills by category
  const getSkillsByCategory = (categoryId: number) => {
    if (skillsLoading || !skills) return [];
    return skills.filter((skill: Skill) => skill.categoryId === categoryId);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Skills Management</h1>
          <p className="text-muted-foreground">Manage your skills and skill categories</p>
        </div>

        {(categoriesError || skillsError) && (
          <Alert variant="destructive">
            <AlertDescription>
              {categoriesError instanceof Error
                ? categoriesError.message
                : skillsError instanceof Error
                ? skillsError.message
                : "An error occurred while fetching data"}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code size={16} />
              Skills
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderTree size={16} />
              Categories
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart size={16} />
              Overview
            </TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Skills List</h2>
              <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    <DialogDescription>
                      Add a new skill to your portfolio. Skills must belong to a category.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...skillForm}>
                    <form onSubmit={skillForm.handleSubmit(onAddSkill)} className="space-y-4 pt-4">
                      <FormField
                        control={skillForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skill Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. React, TypeScript, Redux" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={skillForm.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category: SkillCategory) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={skillForm.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proficiency Level ({field.value}%)</FormLabel>
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={1}
                                max={100}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              Set your proficiency level from 1-100%
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={addSkillMutation.isPending}>
                          {addSkillMutation.isPending ? "Adding..." : "Add Skill"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {skillsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="h-5 w-1/3 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Proficiency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills?.length > 0 ? (
                    skills.map((skill: Skill) => (
                      <TableRow key={skill.id}>
                        <TableCell>{skill.name}</TableCell>
                        <TableCell>{getCategoryName(skill.categoryId)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-secondary h-2 rounded-full">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-xs">{skill.level}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSkill(skill)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingSkill(skill)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No skills found. Add your first skill to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categories List</h2>
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Skill Category</DialogTitle>
                    <DialogDescription>
                      Add a new category to organize your skills.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...categoryForm}>
                    <form onSubmit={categoryForm.handleSubmit(onAddCategory)} className="space-y-4 pt-4">
                      <FormField
                        control={categoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Frontend, Backend, DevOps" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={categoryForm.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. code, database, server" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter an icon name from Lucide React
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={categoryForm.control}
                        name="displayOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormDescription>
                              Categories are sorted by this value (lowest first)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={addCategoryMutation.isPending}>
                          {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {categoriesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="h-5 w-1/3 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {categories?.length > 0 ? (
                  categories.map((category: SkillCategory) => (
                    <Card key={category.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {category.name}
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingCategory(category)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>Icon: {category.icon}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {getSkillsByCategory(category.id).length} skills in this category
                        </p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-sm text-muted-foreground">
                          Display order: {category.displayOrder}
                        </p>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p>No categories found. Add your first category to get started.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold">Skills Overview</h2>

            {categoriesLoading || skillsLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 w-1/4 bg-muted rounded animate-pulse" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-4 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : categories?.length > 0 ? (
              categories.map((category: SkillCategory) => {
                const categorySkills = getSkillsByCategory(category.id);
                return (
                  <Card key={category.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{categorySkills.length} skills</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {categorySkills.length > 0 ? (
                        <div className="space-y-4">
                          {categorySkills.map((skill: Skill) => (
                            <div key={skill.id} className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-sm text-muted-foreground">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-secondary h-2 rounded-full">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills in this category</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p>No skills or categories defined yet. Add some to get started.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Skill Dialog */}
      {editingSkill && (
        <Dialog open={!!editingSkill} onOpenChange={(open) => !open && setEditingSkill(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Skill</DialogTitle>
              <DialogDescription>Update the details of this skill.</DialogDescription>
            </DialogHeader>

            <Form {...skillForm}>
              <form onSubmit={skillForm.handleSubmit(onEditSkill)} className="space-y-4 pt-4">
                <FormField
                  control={skillForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={skillForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category: SkillCategory) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={skillForm.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency Level ({field.value}%)</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          min={1}
                          max={100}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingSkill(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateSkillMutation.isPending}>
                    {updateSkillMutation.isPending ? "Updating..." : "Update Skill"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update the details of this category.</DialogDescription>
            </DialogHeader>

            <Form {...categoryForm}>
              <form onSubmit={categoryForm.handleSubmit(onEditCategory)} className="space-y-4 pt-4">
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoryForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter an icon name from Lucide React
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoryForm.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateCategoryMutation.isPending}>
                    {updateCategoryMutation.isPending ? "Updating..." : "Update Category"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Category Confirmation */}
      {deletingCategory && (
        <Dialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the category "{deletingCategory.name}"? This will also delete all skills in this category.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingCategory(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteCategoryMutation.mutate(deletingCategory.id)}
                disabled={deleteCategoryMutation.isPending}
              >
                {deleteCategoryMutation.isPending ? "Deleting..." : "Delete Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Skill Confirmation */}
      {deletingSkill && (
        <Dialog open={!!deletingSkill} onOpenChange={(open) => !open && setDeletingSkill(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Skill</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the skill "{deletingSkill.name}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingSkill(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteSkillMutation.mutate(deletingSkill.id)}
                disabled={deleteSkillMutation.isPending}
              >
                {deleteSkillMutation.isPending ? "Deleting..." : "Delete Skill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}