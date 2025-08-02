import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./button";
import { Menu, X, Search, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import { Portal } from "@/components/Portal";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const navigationItems = [
    { label: "Find Jobs", href: "/find-jobs", icon: Search },
    { label: "Find Talent", href: "/find-talent", icon: User },
    { label: "Post Job", href: "/post-job", icon: Briefcase },
   { label: "Applied Jobs", href: "/applied-jobs" },
    { label: "Saved Jobs", href: "/saved-jobs" },
  ];

  return (
    <nav className={cn("w-full bg-background/80 backdrop-blur-md border-b border-border", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
           
            <span className="text-xl font-bold gradient-text">Findy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 flex items-center space-x-1"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Login Button or Profile */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  className="focus:outline-none"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                >
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{user.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </button>
                {profileMenuOpen && (
                  <Portal>
                    <div
                      className="fixed right-8 top-16 w-40 bg-white border rounded shadow-lg z-[99999]"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={e => {
                          e.stopPropagation();
                          setProfileMenuOpen(false);
                          router.push("/profile");
                        }}
                      >
                        Settings
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={e => {
                          e.stopPropagation();
                          logout();
                          setProfileMenuOpen(false);
                          toast({ title: "Logged out" });
                          router.push("/login");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </Portal>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border animate-slide-up">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-foreground/80 hover:text-primary transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/profile");
                    }}
                  >
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      toast({ title: "Logged out" });
                      router.push("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 