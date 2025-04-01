import { useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Code,
  BookOpen,
  Settings,
  User,
  LogOut,
  Menu,
  Mail,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, label, icon, isActive, onClick }: NavItemProps) => {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(href);
    if (onClick) onClick();
  };

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`justify-start w-full ${isActive ? "bg-secondary" : ""}`}
      onClick={handleClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return await response.json();
    }
  });

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isLoading && data && !data.authenticated) {
      setLocation("/admin/login");
    }
  }, [data, isLoading, setLocation]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      toast({
        title: "Logged out successfully",
      });
      
      setLocation("/admin/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const closeSheet = () => {
    setIsOpen(false);
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/education", label: "Education", icon: <GraduationCap size={18} /> },
    { href: "/admin/experience", label: "Experience", icon: <Briefcase size={18} /> },
    { href: "/admin/skills", label: "Skills", icon: <Code size={18} /> },
    { href: "/admin/projects", label: "Projects", icon: <BookOpen size={18} /> },
    { href: "/admin/open-source", label: "Open Source", icon: <Code size={18} /> },
    { href: "/admin/about", label: "About", icon: <User size={18} /> },
    { href: "/admin/contact", label: "Contact", icon: <Mail size={18} /> },
    { href: "/admin/theme", label: "Theme", icon: <Palette size={18} /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  // If loading or authentication failed, show skeleton
  if (isLoading || error || (data && !data.authenticated)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b">
          <div className="container flex h-14 items-center px-4">
            <Skeleton className="h-8 w-[200px]" />
          </div>
        </header>
        <div className="flex-1 container grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 p-4">
          <aside className="hidden md:flex flex-col gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
          </aside>
          <main className="flex flex-1 flex-col gap-4">
            <Skeleton className="h-10 w-[50%]" />
            <div className="grid gap-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full" />
                ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                  <nav className="flex flex-col gap-2 mt-4">
                    {navItems.map((item) => (
                      <NavItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        isActive={location === item.href}
                        onClick={closeSheet}
                      />
                    ))}
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
                      onClick={() => {
                        closeSheet();
                        handleLogout();
                      }}
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
              View Site
            </Button>
            {!isMobile && (
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 p-4">
        {!isMobile && (
          <aside className="flex flex-col gap-2">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={location === item.href}
                />
              ))}
            </nav>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </aside>
        )}
        <main className="flex flex-1 flex-col gap-6">{children}</main>
      </div>
    </div>
  );
}