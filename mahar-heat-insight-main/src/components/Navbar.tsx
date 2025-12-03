import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, BarChart3, Lightbulb, Activity, Bot, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const navItems = [
    { to: "/map", icon: MapPin, label: "Map" },
    { to: "/predict", icon: TrendingUp, label: "Predict" },
    { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { to: "/simulator", icon: Activity, label: "Simulator" },
    { to: "/ai-advisor", icon: Bot, label: "AI Advisor" },
    { to: "/recommendations", icon: Lightbulb, label: "Insights" },
  ];

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-smooth" end>
            <div className="p-2 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg shadow-glow">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                UHI Maharashtra
              </h1>
              <p className="text-xs text-muted-foreground">AI for Cooler Cities</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg hover:bg-muted/50 transition-smooth flex items-center gap-2"
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="px-4 py-3 rounded-lg hover:bg-muted/50 transition-smooth flex items-center gap-3"
                    activeClassName="bg-primary/10 text-primary font-medium"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
