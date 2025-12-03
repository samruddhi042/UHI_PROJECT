import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIInsightsWidget } from "@/components/AIInsightsWidget";
import { 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  Lightbulb, 
  Thermometer, 
  Activity,
  Leaf,
  CloudRain,
  Bot
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: "Interactive Map Explorer",
      description: "Visualize UHI intensity and health risk across Maharashtra's regional clusters with dynamic heatmaps.",
      link: "/map",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Predictions",
      description: "Upload CSV data or input coordinates to predict Urban Heat Island intensity and health impact.",
      link: "/predict",
    },
    {
      icon: BarChart3,
      title: "Cluster Analytics",
      description: "Compare model performance, analyze feature importance, and explore detailed metrics for each region.",
      link: "/dashboard",
    },
    {
      icon: Lightbulb,
      title: "Scenario Simulation",
      description: "Adjust environmental parameters and see real-time impact predictions on UHI and health risk.",
      link: "/simulator",
    },
    {
      icon: Bot,
      title: "AI Climate Advisor",
      description: "Chat with Gemini AI for personalized mitigation strategies and educational climate insights.",
      link: "/ai-advisor",
    },
  ];

  const stats = [
    { label: "Regional Clusters", value: "12+", icon: MapPin },
    { label: "ML Models", value: "5", icon: Activity },
    { label: "Accuracy", value: "95%", icon: TrendingUp },
    { label: "Data Points", value: "10K+", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary-dark opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-primary/20">
              <Thermometer className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Advanced Climate Analytics Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              UHI Maharashtra
              <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Ensemble Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              AI for Cooler Cities — Together, we can beat the heat. Empowering data-driven climate action 
              and public health planning across Maharashtra.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/map">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-lg shadow-primary/20">
                  Explore Interactive Map
                </Button>
              </Link>
              <Link to="/predict">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Start Predicting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Comprehensive Climate Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore powerful tools for analyzing, predicting, and mitigating Urban Heat Island effects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="p-6 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                  <div className="space-y-4">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-smooth">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced ensemble learning combines multiple ML models for superior accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: MapPin, title: "Data Collection", desc: "Satellite imagery, sensors, and environmental data" },
              { icon: Activity, title: "ML Processing", desc: "Ensemble of 5+ algorithms analyze patterns" },
              { icon: BarChart3, title: "Predictions", desc: "Accurate UHI intensity and health risk forecasts" },
              { icon: Lightbulb, title: "Actionable Insights", desc: "AI-generated mitigation recommendations" },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-card rounded-full border-2 border-primary">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 text-center space-y-6 border-primary/20 shadow-xl">
            <div className="flex justify-center gap-4">
              <Leaf className="h-12 w-12 text-primary" />
              <CloudRain className="h-12 w-12 text-secondary" />
              <Thermometer className="h-12 w-12 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Explore Climate Data?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start analyzing Urban Heat Island patterns, predict future trends, and discover 
              data-driven solutions for climate resilience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/map">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                  View Interactive Map
                </Button>
              </Link>
              <Link to="/recommendations">
                <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                  Get AI Recommendations
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* AI Insights Widget */}
      <AIInsightsWidget />
    </div>
  );
};

export default Home;
