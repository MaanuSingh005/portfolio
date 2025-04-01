import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  User, 
  Award, 
  Code, 
  BookOpen, 
  BriefcaseBusiness,
  BarChart,
  ArrowUpRight,
  Eye,
  Calendar,
  Sparkles,
  MessageSquare
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  change?: number;
  changeLabel?: string;
}

interface ActivityItemProps {
  action: string;
  section: string;
  date: string;
  isNew?: boolean;
}

const StatCard = ({ title, value, description, icon, isLoading = false, change, changeLabel }: StatCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="rounded-full bg-secondary/80 p-1">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-7 w-[80px]" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      {change !== undefined && (
        <div className={`flex items-center mt-1 text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <ArrowUpRight className={`h-3 w-3 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
          <span>{change}% {changeLabel || 'from last month'}</span>
        </div>
      )}
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const ActivityItem = ({ action, section, date, isNew = false }: ActivityItemProps) => (
  <div className="flex items-start space-x-4 py-2">
    <div className="mt-1">
      <div className={`h-2 w-2 rounded-full ${isNew ? 'bg-green-500' : 'bg-blue-500'}`}></div>
    </div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium">{action}</p>
      <div className="flex items-center text-xs text-muted-foreground">
        <span className="font-medium text-primary">{section}</span>
        <span className="mx-2">•</span>
        <span>{date}</span>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [analyticsTab, setAnalyticsTab] = useState("views");

  const { data: authData, isLoading: isAuthLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return await response.json();
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && authData && !authData.authenticated) {
      setLocation("/admin/login");
    }
  }, [authData, isAuthLoading, setLocation]);

  // Fetch data for stats
  const { data: educationData, isLoading: isEducationLoading } = useQuery({
    queryKey: ["/api/education"],
    queryFn: async () => {
      const response = await fetch("/api/education");
      if (!response.ok) {
        throw new Error("Failed to fetch education data");
      }
      return await response.json();
    }
  });

  const { data: experienceData, isLoading: isExperienceLoading } = useQuery({
    queryKey: ["/api/experience"],
    queryFn: async () => {
      const response = await fetch("/api/experience");
      if (!response.ok) {
        throw new Error("Failed to fetch experience data");
      }
      return await response.json();
    }
  });

  const { data: skillsData, isLoading: isSkillsLoading } = useQuery({
    queryKey: ["/api/skills"],
    queryFn: async () => {
      const response = await fetch("/api/skills");
      if (!response.ok) {
        throw new Error("Failed to fetch skills data");
      }
      return await response.json();
    }
  });

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects data");
      }
      return await response.json();
    }
  });

  const { data: openSourceData, isLoading: isOpenSourceLoading } = useQuery({
    queryKey: ["/api/open-source"],
    queryFn: async () => {
      const response = await fetch("/api/open-source");
      if (!response.ok) {
        throw new Error("Failed to fetch open source data");
      }
      return await response.json();
    }
  });

  const { data: portfolioSettings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio settings");
      }
      return await response.json();
    }
  });

  // Simulate analytics data (would be real in production)
  const portfolioAnalytics = {
    totalViews: 1243,
    viewsChange: 14.5,
    uniqueVisitors: 842,
    uniqueVisitorsChange: 7.8,
    averageTimeOnSite: "2m 32s",
    topProject: "E-commerce Platform",
    topProjectViews: 187,
    contactClicks: 34,
    contactClicksChange: 23.5
  };

  const recentActivity = [
    { 
      action: "Updated project details", 
      section: "Projects", 
      date: "Today at 10:23 AM",
      isNew: true
    },
    { 
      action: "Added a new skill", 
      section: "Skills", 
      date: "Yesterday at 3:45 PM"
    },
    { 
      action: "Modified experience information", 
      section: "Experience", 
      date: "Yesterday at 2:30 PM"
    },
    { 
      action: "Changed theme settings", 
      section: "Theme", 
      date: "2 days ago at 5:15 PM"
    }
  ];

  const topProjects = projectsData?.slice(0, 3).map((project: any, index: number) => ({
    name: project.title,
    views: 180 - (index * 35), // Simulated data
    clicks: 43 - (index * 12) // Simulated data
  })) || [];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your portfolio admin dashboard. Manage your professional profile and see analytics.
          </p>
        </div>

        {/* Content Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Education Entries"
            value={educationData?.length || 0}
            icon={<Award className="h-4 w-4 text-primary" />}
            isLoading={isEducationLoading}
          />
          <StatCard
            title="Experience Entries"
            value={experienceData?.length || 0}
            icon={<BriefcaseBusiness className="h-4 w-4 text-primary" />}
            isLoading={isExperienceLoading}
          />
          <StatCard
            title="Skills"
            value={skillsData?.length || 0}
            icon={<Code className="h-4 w-4 text-primary" />}
            isLoading={isSkillsLoading}
          />
          <StatCard
            title="Projects"
            value={projectsData?.length || 0}
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            isLoading={isProjectsLoading}
          />
          <StatCard
            title="Open Source Contributions"
            value={openSourceData?.length || 0}
            icon={<Globe className="h-4 w-4 text-primary" />}
            isLoading={isOpenSourceLoading}
          />
          <StatCard
            title="Portfolio Theme"
            value={portfolioSettings?.variant || 'Default'}
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          />
        </div>

        {/* Analytics Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Analytics Cards */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Visitor Analytics</CardTitle>
              <CardDescription>
                Track how visitors interact with your portfolio
              </CardDescription>
              <Tabs defaultValue="views" className="mt-4" onValueChange={setAnalyticsTab}>
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="views" className="flex items-center justify-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Views
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center justify-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="engagement" className="flex items-center justify-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    Engagement
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="views" className="mt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <StatCard
                    title="Total Views"
                    value={portfolioAnalytics.totalViews}
                    icon={<Eye className="h-4 w-4 text-primary" />}
                    change={portfolioAnalytics.viewsChange}
                  />
                  <StatCard
                    title="Unique Visitors"
                    value={portfolioAnalytics.uniqueVisitors}
                    icon={<User className="h-4 w-4 text-primary" />}
                    change={portfolioAnalytics.uniqueVisitorsChange}
                  />
                  <StatCard
                    title="Contact Inquiries"
                    value={portfolioAnalytics.contactClicks}
                    icon={<MessageSquare className="h-4 w-4 text-primary" />}
                    change={portfolioAnalytics.contactClicksChange}
                  />
                </div>
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Monthly Traffic</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center">
                        Implement chart visualization based on actual traffic data here.<br/>
                        Connect to Google Analytics or similar service for real metrics.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Top Performing Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {topProjects.length > 0 ? (
                        <div className="space-y-4">
                          {topProjects.map((project: any, index: number) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{project.name}</span>
                                <span className="text-sm text-muted-foreground">{project.views} views</span>
                              </div>
                              <Progress value={(project.views / 180) * 100} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No project data available</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground text-center">
                          Project interaction data visualization would go here.<br/>
                          Shows how users engage with your projects.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="mt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Average Time on Site</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center space-y-2 pt-4">
                        <div className="text-4xl font-bold">{portfolioAnalytics.averageTimeOnSite}</div>
                        <p className="text-sm text-muted-foreground">Average session duration</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Most Viewed Sections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Projects</span>
                            <span className="text-sm text-muted-foreground">42%</span>
                          </div>
                          <Progress value={42} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Skills</span>
                            <span className="text-sm text-muted-foreground">28%</span>
                          </div>
                          <Progress value={28} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Experience</span>
                            <span className="text-sm text-muted-foreground">18%</span>
                          </div>
                          <Progress value={18} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 inline-block mr-1" />
                Data shown is for demonstration purposes. Connect to a real analytics service to see actual visitor data.
              </p>
            </CardFooter>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent dashboard activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-1">
                  {recentActivity.map((activity: any, index: number) => (
                    <ActivityItem 
                      key={index}
                      action={activity.action}
                      section={activity.section}
                      date={activity.date}
                      isNew={activity.isNew}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activity to display. Activities will be shown here once you start making changes.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start h-auto py-3"
                  onClick={() => setLocation("/admin/education")}
                >
                  <Award className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Education</div>
                    <div className="text-xs text-muted-foreground">Add or update education entries</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start h-auto py-3"
                  onClick={() => setLocation("/admin/skills")}
                >
                  <Code className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Skills</div>
                    <div className="text-xs text-muted-foreground">Manage your technical skills</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start h-auto py-3"
                  onClick={() => setLocation("/admin/projects")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Projects</div>
                    <div className="text-xs text-muted-foreground">Add or edit showcase projects</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start h-auto py-3"
                  onClick={() => setLocation("/admin/theme")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Theme Settings</div>
                    <div className="text-xs text-muted-foreground">Customize portfolio appearance</div>
                  </div>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="default" size="sm" className="w-full" onClick={() => setLocation("/")}>
                View Your Portfolio
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}