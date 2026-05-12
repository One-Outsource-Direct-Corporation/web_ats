import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, LayoutDashboard, User, LogOut, ChevronsUpDown, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const navLinks = [
  { path: "/", label: "Job Openings", icon: Briefcase },
  { path: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/candidate/profile", label: "My Profile", icon: User },
];

export default function CandidateNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useLogout();

  const isActivePath = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (error: AxiosError | any) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img
              src="/OODC%20logo3.png"
              alt="One Outsource"
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-3 text-sm transition-colors",
                    isActivePath(link.path)
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-primary"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="rounded-full bg-blue-600 h-8 w-8 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.first_name?.[0]?.toUpperCase()}
                  {user?.last_name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {user?.first_name} {user?.last_name}
                </span>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/candidate/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  <span>My Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
