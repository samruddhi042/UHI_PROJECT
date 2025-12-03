import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, X, TrendingUp, AlertTriangle, Leaf, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIInsightsWidgetProps {
  clusterName?: string;
  uhiScore?: number;
  healthRisk?: number;
  suggestions?: string[];
}

export const AIInsightsWidget = ({
  clusterName = "Mumbai Cluster",
  uhiScore = 8.5,
  healthRisk = 7.2,
  suggestions = [
    "Increase green cover by 15% to reduce UHI by 2.3°C",
    "Implement cool roofs on 1,000 buildings",
    "Create 5 new urban parks in dense areas",
  ],
}: AIInsightsWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-glow hover:shadow-glow-accent transition-smooth hover:scale-110 animate-pulse-glow"
          >
            <Brain className="h-6 w-6 text-white animate-pulse" />
          </Button>
        )}

        {/* Expanded Widget */}
        {isOpen && (
          <Card className="w-80 bg-gradient-to-br from-card to-muted/30 border-primary/30 shadow-xl animate-scale-in hover:shadow-2xl transition-all duration-300">
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                    <Brain className="h-4 w-4 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">AI Insights</h3>
                    <p className="text-xs text-muted-foreground">{clusterName}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:scale-110 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <div className="p-3 bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3 w-3 text-destructive animate-pulse" />
                    <span className="text-xs text-muted-foreground">UHI Score</span>
                  </div>
                  <div className="text-xl font-bold text-destructive animate-pulse">{uhiScore}°C</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-3 w-3 text-orange-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Health Risk</span>
                  </div>
                  <div className="text-xl font-bold text-orange-500 animate-pulse">{healthRisk}</div>
                </div>
              </div>

              {/* Top Suggestions */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                  Top Mitigation Strategies
                </h4>
                <div className="space-y-2">
                  {suggestions.slice(0, 3).map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-green-500/5 border border-green-500/10 rounded text-xs text-muted-foreground hover:bg-green-500/10 transition-smooth hover:scale-105"
                    >
                      <span className="text-green-500 mr-2">🌳</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/simulator")}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-secondary text-secondary hover:bg-secondary/10 text-xs"
                >
                  Simulate Impact
                </Button>
                <Button
                  onClick={() => navigate("/recommendations")}
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary-dark text-xs"
                >
                  View All
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};
