import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Download, Leaf, Building2, CloudRain, Droplets, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api, MitigationStrategy } from "@/lib/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Recommendations = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategies, setStrategies] = useState<MitigationStrategy[]>([]);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const { toast } = useToast();

  // Default area (Pune)
  const defaultArea = { center: { lat: 18.5204, lng: 73.8567 } };

  const handleGenerateStrategies = async () => {
    setIsLoadingStrategies(true);
    try {
      const result = await api.getMitigationStrategies({
        area: defaultArea,
      });
      setStrategies(result.strategies);
      toast({
        title: "Strategies Generated",
        description: `Found ${result.strategies.length} mitigation strategies`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate strategies",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStrategies(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Try server-side PDF first
      const reportData = {
        title: "UHI Mitigation Strategies Report",
        city: "Pune",
        area: defaultArea,
        data_summary: {
          avg_uhi: strategies.length > 0 ? "8.5" : "N/A",
          temp_range: "30-38°C",
        },
        predictions: [],
        strategies: strategies.length > 0 ? strategies : [],
      };

      try {
        const pdfBlob = await api.generateReport(reportData);
        if (pdfBlob instanceof Blob) {
          // Server-side PDF succeeded
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `uhi_strategies_report_${new Date().toISOString().split("T")[0]}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: "PDF Generated",
            description: "Report downloaded successfully (server-side)",
          });
          setIsGenerating(false);
          return;
        }
      } catch (serverError) {
        // Fall through to client-side generation
        console.log("Server-side PDF not available, using client-side");
      }

      // Client-side PDF generation (fallback)
      const element = document.getElementById("report-content");
      if (!element) {
        throw new Error("Report content not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`uhi_strategies_report_${new Date().toISOString().split("T")[0]}.pdf`);
      toast({
        title: "PDF Generated",
        description: "Report downloaded successfully (client-side)",
      });
    } catch (error: any) {
      toast({
        title: "PDF Generation Failed",
        description: error.message || "Could not generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const displayStrategies = strategies.length > 0 ? strategies : [
    {
      title: "Increase Urban Vegetation Coverage",
      category: "Green Infrastructure",
      priority: "high",
      explanation: "Expand green spaces by planting native trees and creating urban forests. Target a 25% increase in NDVI across high-risk clusters.",
      impact: "Expected UHI reduction: 1.2°C",
    },
    {
      title: "Cool Roofs & Reflective Surfaces",
      category: "Building Materials",
      priority: "high",
      explanation: "Mandate cool roof installations for new constructions and incentivize retrofits for existing buildings.",
      impact: "Expected UHI reduction: 0.8°C",
    },
    {
      title: "Enhance Microclimate Regulation",
      category: "Climate Adaptation",
      priority: "medium",
      explanation: "Install misting systems in public spaces during heat waves. Create water features to improve thermal comfort.",
      impact: "Expected health risk reduction: 15%",
    },
    {
      title: "High-Albedo Pavements",
      category: "Urban Planning",
      priority: "medium",
      explanation: "Replace dark asphalt with light-colored or permeable pavements to reduce surface temperature by 3-7°C.",
      impact: "Expected UHI reduction: 0.5°C",
    },
  ] as MitigationStrategy[];

  const getIconForCategory = (category: string) => {
    if (category.includes("Green") || category.includes("Vegetation")) return Leaf;
    if (category.includes("Building") || category.includes("Roof")) return Building2;
    if (category.includes("Water") || category.includes("Evaporative")) return Droplets;
    if (category.includes("Climate") || category.includes("Microclimate")) return CloudRain;
    return Lightbulb;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">AI-Powered Recommendations</h1>
          <p className="text-muted-foreground">
            Data-driven mitigation strategies to reduce Urban Heat Island effects and improve public health
          </p>
        </div>

        {/* Action Bar */}
        <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Generate Custom Report</div>
              <div className="text-sm text-muted-foreground">AI-powered recommendations for your area</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateStrategies}
              disabled={isLoadingStrategies}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              {isLoadingStrategies ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Strategies
                </>
              )}
            </Button>
            <Button onClick={handleDownloadPDF} disabled={isGenerating} className="bg-accent text-accent-foreground hover:bg-accent-dark">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Report Content (for PDF generation) */}
        <div id="report-content" className="space-y-6">
          {/* Recommendations */}
          <div className="space-y-6">
            {displayStrategies.map((rec, idx) => {
              const Icon = getIconForCategory(rec.category);
              return (
                <Card key={idx} className="p-6 space-y-6 hover:shadow-lg transition-smooth">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-semibold text-foreground">{rec.title}</h3>
                          <Badge
                            variant={rec.priority === "high" ? "destructive" : "secondary"}
                            className={rec.priority === "high" ? "bg-accent text-accent-foreground" : ""}
                          >
                            {rec.priority} Priority
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{rec.category}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">{rec.explanation}</p>

                  {/* Impact Badge */}
                  {rec.impact && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-green-600">
                        <Lightbulb className="h-4 w-4" />
                        <span className="font-semibold text-sm">{rec.impact}</span>
                      </div>
                    </div>
                  )}

                  {/* Additional info */}
                  {(rec.cost || rec.feasibility) && (
                    <div className="flex gap-4 text-sm">
                      {rec.cost && (
                        <div>
                          <span className="text-muted-foreground">Cost: </span>
                          <span className="font-medium">{rec.cost}</span>
                        </div>
                      )}
                      {rec.feasibility && (
                        <div>
                          <span className="text-muted-foreground">Feasibility: </span>
                          <span className="font-medium">{rec.feasibility}</span>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Summary Card */}
          <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Implementation Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary mb-1">{displayStrategies.length}</div>
                <div className="text-sm text-muted-foreground">Total Strategies</div>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent mb-1">2.5°C</div>
                <div className="text-sm text-muted-foreground">Potential UHI Reduction</div>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-green-500 mb-1">15%</div>
                <div className="text-sm text-muted-foreground">Health Risk Reduction</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Implementing these recommendations in combination can significantly reduce Urban Heat Island
              effects and improve public health outcomes across Maharashtra's regional clusters. Prioritize
              high-impact interventions in areas with the highest UHI intensity.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
