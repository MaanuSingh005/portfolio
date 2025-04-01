import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, User, Award, Code, BookOpen, BriefcaseBusiness } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const StatCard = ({ title, value, description, icon, isLoading = false }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-7 w-[80px]" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

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

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin dashboard. Manage your professional profile from here.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Education Entries"
            value={educationData?.length || 0}
            icon={<Award className="h-4 w-4 text-muted-foreground" />}
            isLoading={isEducationLoading}
          />
          <StatCard
            title="Experience Entries"
            value={experienceData?.length || 0}
            icon={<BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />}
            isLoading={isExperienceLoading}
          />
          <StatCard
            title="Skills"
            value={skillsData?.length || 0}
            icon={<Code className="h-4 w-4 text-muted-foreground" />}
            isLoading={isSkillsLoading}
          />
          <StatCard
            title="Projects"
            value={projectsData?.length || 0}
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            isLoading={isProjectsLoading}
          />
          <StatCard
            title="Open Source Contributions"
            value={openSourceData?.length || 0}
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            isLoading={isOpenSourceLoading}
          />
          <StatCard
            title="Profile Status"
            value="Active"
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent dashboard activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent activity to display. Activities will be shown here once you start making changes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  <a 
                    href="#" 
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("/admin/education");
                    }}
                  >
                    Add new education entry
                  </a>
                </p>
                <p className="text-sm font-medium">
                  <a 
                    href="#" 
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("/admin/skills");
                    }}
                  >
                    Update skills
                  </a>
                </p>
                <p className="text-sm font-medium">
                  <a 
                    href="#" 
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("/admin/projects");
                    }}
                  >
                    Add new project
                  </a>
                </p>
                <p className="text-sm font-medium">
                  <a 
                    href="#" 
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("/admin/theme");
                    }}
                  >
                    Change theme settings
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}