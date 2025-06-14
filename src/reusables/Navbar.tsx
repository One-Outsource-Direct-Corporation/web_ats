import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Library,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routes = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/users",
      label: "Users",
      icon: Users,
    },
    {
      path: "/positions",
      label: "Positions",
      icon: Briefcase,
    },
    {
      path: "/library",
      label: "Library",
      icon: Library,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6 z-50 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/OODC logo.png" alt="Company Logo" className="h-10 w-auto" />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 mx-auto">
            {routes.map((route) => (
              <Link key={route.path} to={route.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-3 text-sm transition-colors",
                    location.pathname === route.path
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-primary"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-white">
              U
            </div>
            <span>Username</span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6 z-50">
        <div className="flex items-center justify-between w-full">
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                {/* Logo in mobile menu */}
                <div className="p-4 border-b">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <img
                      src="/OODC logo.png"
                      alt="Company Logo"
                      className="h-7 w-auto"
                    />
                  </Link>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 px-4 py-6 text-base transition-colors",
                          location.pathname === route.path
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-primary"
                        )}
                      >
                        <route.icon className="h-5 w-5" />
                        <span>{route.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* Mobile User Profile */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary h-10 w-10 flex items-center justify-center text-white">
                      U
                    </div>
                    <div>
                      <p className="font-medium">Username</p>
                      <p className="text-sm text-muted-foreground">user@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Logo */}
          <Link
            to="/dashboard"
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <img src="/OODC logo.png" alt="Company Logo" className="h-7 w-auto" />
          </Link>

          {/* Empty Div */}
          <div className="w-9"></div>
        </div>
      </nav>
    </>
  );
}
