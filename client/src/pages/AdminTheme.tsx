import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Palette, Sparkles, Monitor, RefreshCcw, MoonStar, Sun, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Theme settings schema
const themeSettingsSchema = z.object({
  primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code (e.g., #3b82f6)",
  }),
  variant: z.enum(["professional", "tint", "vibrant"]),
  appearance: z.enum(["light", "dark", "system"]),
  radius: z.coerce.number().min(0).max(20),
  siteTitle: z.string().min(1, "Site title is required"),
  // Additional fields
  autoSwitchDarkMode: z.boolean().optional(),
  fontFamily: z.string().optional(),
  navbarStyle: z.enum(["standard", "transparent", "sticky"]).optional(),
  customAccentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
});

type ThemeSettings = z.infer<typeof themeSettingsSchema>;

export default function AdminTheme() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [previewVariant, setPreviewVariant] = useState<"light" | "dark">("light");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [backupTheme, setBackupTheme] = useState<ThemeSettings | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Get current theme settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch theme settings");
      }
      return await response.json();
    }
  });

  const form = useForm<ThemeSettings>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      primary: "#3b82f6",
      variant: "professional",
      appearance: "system",
      radius: 8,
      siteTitle: "Kamal Jeet - Software Developer",
      autoSwitchDarkMode: true,
      fontFamily: "Inter",
      navbarStyle: "standard",
      customAccentColor: "#4338ca",
    },
  });

  // Update form with settings when data is loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        primary: settings.primary || "#3b82f6",
        variant: settings.variant || "professional",
        appearance: settings.appearance || "system",
        radius: settings.radius || 8,
        siteTitle: settings.siteTitle || "Kamal Jeet - Software Developer",
        autoSwitchDarkMode: settings.autoSwitchDarkMode !== undefined ? settings.autoSwitchDarkMode : true,
        fontFamily: settings.fontFamily || "Inter",
        navbarStyle: settings.navbarStyle || "standard",
        customAccentColor: settings.customAccentColor || "#4338ca",
      });
      // Save backup for revert functionality
      setBackupTheme({
        primary: settings.primary || "#3b82f6",
        variant: settings.variant || "professional",
        appearance: settings.appearance || "system",
        radius: settings.radius || 8,
        siteTitle: settings.siteTitle || "Kamal Jeet - Software Developer",
        autoSwitchDarkMode: settings.autoSwitchDarkMode !== undefined ? settings.autoSwitchDarkMode : true,
        fontFamily: settings.fontFamily || "Inter",
        navbarStyle: settings.navbarStyle || "standard",
        customAccentColor: settings.customAccentColor || "#4338ca",
      });
    }
  }, [settings, form]);

  // Update theme preview when form values change
  useEffect(() => {
    const subscription = form.watch(() => {
      setUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Update theme settings mutation
  const updateThemeMutation = useMutation({
    mutationFn: async (data: ThemeSettings) => {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update theme settings");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Theme settings updated successfully",
      });
      setUnsavedChanges(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update theme settings",
      });
    },
  });

  const onSubmit = (data: ThemeSettings) => {
    // Store backup for potential revert
    setBackupTheme(data);
    
    // Update theme settings
    updateThemeMutation.mutate(data);
  };

  // Helper to get preview class based on mode
  const getPreviewClass = () => {
    switch (previewMode) {
      case "mobile":
        return "w-[320px] h-[568px]";
      case "tablet":
        return "w-[768px] h-[680px]";
      default:
        return "w-full h-[680px]";
    }
  };

  // Revert to last saved theme
  const handleRevert = () => {
    if (backupTheme) {
      form.reset(backupTheme);
      toast({
        title: "Reverted",
        description: "Theme settings have been reverted to last saved state",
      });
      setUnsavedChanges(false);
    }
  };

  // Toggle appearance for preview
  const togglePreviewAppearance = () => {
    setPreviewVariant(previewVariant === "light" ? "dark" : "light");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Theme Settings</h1>
          <p className="text-muted-foreground">
            Customize the appearance of your portfolio website
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "An error occurred while fetching theme settings"}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
          {/* Theme Settings Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Theme Configuration</CardTitle>
                  <CardDescription>Customize your portfolio's appearance</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isAdvancedMode ? "Basic Mode" : "Advanced Mode"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="siteTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This appears in the browser tab and search results
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appearance"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Appearance</FormLabel>
                          <FormDescription>
                            Choose the default appearance mode for your site
                          </FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-1"
                            >
                              <FormItem className="flex items-center space-x-1 space-y-0 border rounded-l-md px-3 py-2 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="light" />
                                </FormControl>
                                <FormLabel className="flex items-center cursor-pointer">
                                  <Sun className="h-4 w-4 mr-2" />
                                  Light
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-1 space-y-0 border px-3 py-2 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="dark" />
                                </FormControl>
                                <FormLabel className="flex items-center cursor-pointer">
                                  <MoonStar className="h-4 w-4 mr-2" />
                                  Dark
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-1 space-y-0 border rounded-r-md px-3 py-2 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="system" />
                                </FormControl>
                                <FormLabel className="flex items-center cursor-pointer">
                                  <Monitor className="h-4 w-4 mr-2" />
                                  System
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="variant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color Variant</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a color variant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="tint">Tint</SelectItem>
                              <SelectItem value="vibrant">Vibrant</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How colors are displayed throughout your portfolio
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <div 
                              className="h-10 w-10 rounded border" 
                              style={{ backgroundColor: field.value }}
                            />
                          </div>
                          <FormDescription>
                            The main accent color for your portfolio (hex color code)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="radius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Border Radius: {field.value}px</FormLabel>
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              min={0}
                              max={20}
                              step={1}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormDescription>
                            Controls the roundness of elements
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isAdvancedMode && (
                      <>
                        <Separator className="my-4" />
                        <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>

                        <FormField
                          control={form.control}
                          name="autoSwitchDarkMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Auto Dark Mode</FormLabel>
                                <FormDescription>
                                  Automatically switch to dark mode based on user's system preference
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

                        <FormField
                          control={form.control}
                          name="fontFamily"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Font Family</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a font family" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Inter">Inter</SelectItem>
                                  <SelectItem value="Roboto">Roboto</SelectItem>
                                  <SelectItem value="Poppins">Poppins</SelectItem>
                                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Primary font used throughout your portfolio
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="navbarStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Navigation Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a navigation style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="transparent">Transparent</SelectItem>
                                  <SelectItem value="sticky">Sticky</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Style of your portfolio's navigation bar
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customAccentColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secondary Accent Color</FormLabel>
                              <div className="flex space-x-2">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <div 
                                  className="h-10 w-10 rounded border" 
                                  style={{ backgroundColor: field.value }}
                                />
                              </div>
                              <FormDescription>
                                Secondary accent color for special elements (hex color code)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleRevert}
                      disabled={!unsavedChanges || updateThemeMutation.isPending}
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Revert Changes
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={updateThemeMutation.isPending || !unsavedChanges}
                    >
                      {updateThemeMutation.isPending 
                        ? "Saving..." 
                        : unsavedChanges 
                          ? "Save Changes" 
                          : "Saved"
                      }
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Theme Preview */}
          <div className="flex flex-col space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>See how your changes will look</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewMode("desktop")}
                      className={previewMode === "desktop" ? "bg-secondary" : ""}
                    >
                      Desktop
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewMode("tablet")}
                      className={previewMode === "tablet" ? "bg-secondary" : ""}
                    >
                      Tablet
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewMode("mobile")}
                      className={previewMode === "mobile" ? "bg-secondary" : ""}
                    >
                      Mobile
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="mb-4 flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={togglePreviewAppearance}>
                    {previewVariant === "light" ? 
                      <><MoonStar className="mr-2 h-4 w-4" /> Switch to Dark Mode</> : 
                      <><Sun className="mr-2 h-4 w-4" /> Switch to Light Mode</>
                    }
                  </Button>
                </div>
                
                <div className={`border rounded overflow-hidden ${getPreviewClass()} transition-all duration-200`}>
                  <div className={`h-full w-full overflow-auto ${previewVariant === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
                    <div 
                      className="p-4 border-b sticky top-0" 
                      style={{ 
                        backgroundColor: previewVariant === "dark" ? "#1a1a1a" : "white",
                        borderColor: previewVariant === "dark" ? "#333" : "#e5e7eb",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold" style={{ color: form.watch("primary") }}>
                          {form.watch("siteTitle")}
                        </span>
                        <div className="flex space-x-4">
                          <span>Home</span>
                          <span>About</span>
                          <span>Projects</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h1 className="text-2xl font-bold mb-2" style={{ color: form.watch("primary") }}>
                        Welcome to my Portfolio
                      </h1>
                      <p className="text-sm mb-4">
                        This is a preview of how your theme settings will look.
                      </p>
                      
                      <div 
                        className="p-3 mb-4" 
                        style={{ 
                          backgroundColor: previewVariant === "dark" ? "#2a2a2a" : "#f9fafb",
                          borderRadius: `${form.watch("radius")}px`,
                          borderColor: previewVariant === "dark" ? "#333" : "#e5e7eb",
                          borderWidth: "1px"
                        }}
                      >
                        <h2 className="text-lg font-semibold mb-2">Skills</h2>
                        <div 
                          className="h-4 mb-2" 
                          style={{ 
                            backgroundColor: previewVariant === "dark" ? "#333" : "#e5e7eb",
                            borderRadius: `${form.watch("radius")}px`,
                            overflow: "hidden" 
                          }}
                        >
                          <div 
                            className="h-full w-[75%]" 
                            style={{ backgroundColor: form.watch("primary") }}
                          ></div>
                        </div>
                        
                        <div 
                          className="h-4 mb-2" 
                          style={{ 
                            backgroundColor: previewVariant === "dark" ? "#333" : "#e5e7eb",
                            borderRadius: `${form.watch("radius")}px`,
                            overflow: "hidden" 
                          }}
                        >
                          <div 
                            className="h-full w-[60%]" 
                            style={{ backgroundColor: form.watch("primary") }}
                          ></div>
                        </div>
                        
                        <div 
                          className="h-4" 
                          style={{ 
                            backgroundColor: previewVariant === "dark" ? "#333" : "#e5e7eb",
                            borderRadius: `${form.watch("radius")}px`,
                            overflow: "hidden" 
                          }}
                        >
                          <div 
                            className="h-full w-[90%]" 
                            style={{ backgroundColor: form.watch("primary") }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div 
                          className="p-3" 
                          style={{ 
                            backgroundColor: previewVariant === "dark" ? "#2a2a2a" : "#f9fafb",
                            borderRadius: `${form.watch("radius")}px`,
                            borderColor: previewVariant === "dark" ? "#333" : "#e5e7eb",
                            borderWidth: "1px"
                          }}
                        >
                          <h3 className="font-bold mb-1" style={{ color: form.watch("primary") }}>
                            Project 1
                          </h3>
                          <p className="text-xs">A sample project preview with your theme settings applied.</p>
                        </div>
                        
                        <div 
                          className="p-3" 
                          style={{ 
                            backgroundColor: previewVariant === "dark" ? "#2a2a2a" : "#f9fafb",
                            borderRadius: `${form.watch("radius")}px`,
                            borderColor: previewVariant === "dark" ? "#333" : "#e5e7eb",
                            borderWidth: "1px"
                          }}
                        >
                          <h3 className="font-bold mb-1" style={{ color: form.watch("primary") }}>
                            Project 2
                          </h3>
                          <p className="text-xs">Another sample project with your theme settings.</p>
                        </div>
                      </div>
                      
                      <button 
                        className="px-4 py-2 text-white text-sm"
                        style={{ 
                          backgroundColor: form.watch("primary"),
                          borderRadius: `${form.watch("radius")}px`,
                        }}
                      >
                        Contact Me
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Theme Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Presets</CardTitle>
                <CardDescription>Apply pre-configured theme settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col"
                    onClick={() => form.reset({
                      ...form.getValues(),
                      primary: "#3b82f6",
                      variant: "professional",
                      radius: 8
                    })}
                  >
                    <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: "#3b82f6" }}></div>
                    <span className="font-medium">Professional Blue</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col"
                    onClick={() => form.reset({
                      ...form.getValues(),
                      primary: "#6d28d9",
                      variant: "vibrant",
                      radius: 12
                    })}
                  >
                    <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: "#6d28d9" }}></div>
                    <span className="font-medium">Creative Purple</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col"
                    onClick={() => form.reset({
                      ...form.getValues(),
                      primary: "#10b981",
                      variant: "tint",
                      radius: 4
                    })}
                  >
                    <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: "#10b981" }}></div>
                    <span className="font-medium">Modern Green</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col"
                    onClick={() => form.reset({
                      ...form.getValues(),
                      primary: "#f59e0b",
                      variant: "vibrant",
                      radius: 16
                    })}
                  >
                    <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: "#f59e0b" }}></div>
                    <span className="font-medium">Vibrant Amber</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Alert variant="default" className="w-full bg-muted/50">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    Apply a preset and then customize it to your liking
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </div>
        </div>

        {unsavedChanges && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Unsaved Changes</AlertTitle>
            <AlertDescription>
              You have unsaved changes. Remember to save to apply them to your portfolio.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
}