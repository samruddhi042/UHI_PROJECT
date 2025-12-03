import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, TrendingUp, Award, Activity } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [selectedCluster, setSelectedCluster] = useState("mumbai");

  const clusters = [
    { value: "mumbai", label: "Mumbai" },
    { value: "pune", label: "Pune" },
    { value: "nagpur", label: "Nagpur" },
    { value: "nashik", label: "Nashik" },
  ];

  const metrics = [
    { label: "RMSE", value: "0.32", unit: "°C", trend: "down" },
    { label: "MAE", value: "0.24", unit: "°C", trend: "down" },
    { label: "R² Score", value: "94%", unit: "", trend: "up" },
    { label: "MAPE", value: "8.5", unit: "%", trend: "down" },
  ];

  const modelPerformance = [
    { model: "Random Forest", rmse: 0.28, mae: 0.21, r2: 0.96, best: true },
    { model: "XGBoost", rmse: 0.32, mae: 0.24, r2: 0.94, best: false },
    { model: "LightGBM", rmse: 0.35, mae: 0.27, r2: 0.92, best: false },
    { model: "Linear Regression", rmse: 0.48, mae: 0.38, r2: 0.85, best: false },
    { model: "SVR", rmse: 0.42, mae: 0.33, r2: 0.88, best: false },
  ];

  const featureImportance = [
    { feature: "Built-up %", importance: 0.28 },
    { feature: "NDVI", importance: 0.24 },
    { feature: "LST Mean", importance: 0.18 },
    { feature: "Humidity", importance: 0.14 },
    { feature: "Population Density", importance: 0.10 },
    { feature: "Month", importance: 0.06 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Cluster Dashboard</h1>
            <p className="text-muted-foreground">
              Analyze model performance and feature importance for each regional cluster
            </p>
          </div>

          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select cluster" />
            </SelectTrigger>
            <SelectContent>
              {clusters.map((cluster) => (
                <SelectItem key={cluster.value} value={cluster.value}>
                  {cluster.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {metric.value}
                  <span className="text-lg text-muted-foreground ml-1">{metric.unit}</span>
                </div>
                <div
                  className={`text-sm flex items-center gap-1 ${
                    metric.trend === "up" ? "text-green-500" : "text-green-500"
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  Better than baseline
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Model Performance */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Model Performance Comparison
            </h2>
            <Badge className="bg-primary text-primary-foreground">
              <Award className="h-3 w-3 mr-1" />
              Ensemble Prediction
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">RMSE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">MAE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">R² Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {modelPerformance.map((model, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-border transition-smooth ${
                      model.best ? "bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{model.model}</span>
                        {model.best && (
                          <Badge variant="default" className="bg-accent text-accent-foreground">
                            Best
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{model.rmse}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{model.mae}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded font-medium">
                        {model.r2}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-primary text-primary">
                        Active
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Feature Importance */}
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Feature Importance Analysis
          </h2>

          <div className="space-y-4">
            {featureImportance.map((feature, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{feature.feature}</span>
                  <span className="text-muted-foreground">{(feature.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${feature.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* UHI vs Health Risk Comparison */}
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">UHI vs Health Risk Correlation</h2>
          
          <div className="h-64 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 text-primary mx-auto" />
              <p className="text-muted-foreground">
                Chart visualization area for UHI vs Health Risk comparison
              </p>
              <p className="text-sm text-muted-foreground">
                (Recharts implementation placeholder)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
