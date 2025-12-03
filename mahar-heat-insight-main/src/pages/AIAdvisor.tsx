import { AIChat } from "@/components/AIChat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIAdvisor = () => {
  const { toast } = useToast();

  const handleDownloadTranscript = () => {
    toast({
      title: "Download Started",
      description: "Chat transcript is being prepared...",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl shadow-glow">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">AI Climate Advisor</h1>
              <p className="text-muted-foreground">
                Ask Gemini AI about Urban Heat Islands, mitigation strategies, and climate data
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-smooth">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Context-Aware</h3>
                <p className="text-sm text-muted-foreground">
                  AI understands cluster data and provides personalized recommendations
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:shadow-lg transition-smooth">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Scientific Reasoning</h3>
                <p className="text-sm text-muted-foreground">
                  Backed by latest climate research and proven mitigation strategies
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-smooth">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent rounded-lg">
                <Download className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Exportable Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Download chat transcripts and AI suggestions as PDF reports
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIChat />
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card className="p-4 space-y-4 bg-gradient-to-br from-card to-muted/20 border-primary/20">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={handleDownloadTranscript}
                  variant="outline"
                  className="w-full justify-start border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Transcript
                </Button>
              </div>
            </Card>

            <Card className="p-4 space-y-3 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <h3 className="font-semibold text-foreground text-sm">Example Questions</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• What is NDVI and why does it matter?</p>
                <p>• How can we reduce heat in Mumbai cluster?</p>
                <p>• Explain the health impacts of UHI</p>
                <p>• What are cool roofs and their effectiveness?</p>
                <p>• Best vegetation for urban cooling in Maharashtra</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
