import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const Simulator = () => {
  const [ndvi, setNdvi] = useState([0.3]);
  const [builtUp, setBuiltUp] = useState([45]);
  const [humidity, setHumidity] = useState([65]);
  const [temperature, setTemperature] = useState([32]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setResults({
        uhi_before: 3.2,
        uhi_after: 2.8,
        health_risk_before: 7.8,
        health_risk_after: 6.5,
        improvement: 12.5,
      });
      setIsSimulating(false);
    }, 1500);
  };

  const handleReset = () => {
    setNdvi([0.3]);
    setBuiltUp([45]);
    setHumidity([65]);
    setTemperature([32]);
    setResults(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Scenario Simulator</h1>
          <p className="text-muted-foreground">
            Adjust environmental parameters and see real-time impact predictions on UHI and health risk
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Environmental Parameters
              </h2>
              <p className="text-sm text-muted-foreground">
                Adjust the sliders to simulate different environmental conditions
              </p>
            </div>

            <div className="space-y-6">
              {/* NDVI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium">NDVI (Vegetation Index)</Label>
                  <Badge variant="outline">{ndvi[0].toFixed(2)}</Badge>
                </div>
                <Slider
                  value={ndvi}
                  onValueChange={setNdvi}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Vegetation (0.0)</span>
                  <span>Dense Vegetation (1.0)</span>
                </div>
              </div>

              {/* Built-up % */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium">Built-up Area %</Label>
                  <Badge variant="outline">{builtUp[0]}%</Badge>
                </div>
                <Slider
                  value={builtUp}
                  onValueChange={setBuiltUp}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>No Development (0%)</span>
                  <span>Fully Urbanized (100%)</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium">Relative Humidity</Label>
                  <Badge variant="outline">{humidity[0]}%</Badge>
                </div>
                <Slider
                  value={humidity}
                  onValueChange={setHumidity}
                  min={20}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Dry (20%)</span>
                  <span>Very Humid (100%)</span>
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium">Ambient Temperature</Label>
                  <Badge variant="outline">{temperature[0]}°C</Badge>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={20}
                  max={45}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cool (20°C)</span>
                  <span>Hot (45°C)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary-dark"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Simulate Impact
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Simulation Results
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Predicted impact based on adjusted parameters
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* UHI Intensity */}
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">UHI Intensity</span>
                        <Badge className="bg-green-500 text-white">
                          -{((results.uhi_before - results.uhi_after) / results.uhi_before * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Before</div>
                          <div className="text-2xl font-bold text-destructive">{results.uhi_before}°C</div>
                        </div>
                        <div className="flex-1 flex items-center">
                          <div className="h-1 flex-1 bg-gradient-to-r from-destructive to-green-500 rounded" />
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">After</div>
                          <div className="text-2xl font-bold text-green-500">{results.uhi_after}°C</div>
                        </div>
                      </div>
                    </div>

                    {/* Health Risk */}
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Health Risk Index</span>
                        <Badge className="bg-green-500 text-white">
                          -{((results.health_risk_before - results.health_risk_after) / results.health_risk_before * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Before</div>
                          <div className="text-2xl font-bold text-destructive">{results.health_risk_before}/10</div>
                        </div>
                        <div className="flex-1 flex items-center">
                          <div className="h-1 flex-1 bg-gradient-to-r from-destructive to-green-500 rounded" />
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">After</div>
                          <div className="text-2xl font-bold text-green-500">{results.health_risk_after}/10</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    <h3 className="font-semibold">Overall Improvement: {results.improvement}%</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The simulated environmental changes would result in a significant reduction in both 
                    UHI intensity and health risk. Consider implementing green infrastructure and 
                    reducing built-up density to achieve similar real-world improvements.
                  </p>
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-muted/50 rounded-full">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Simulation Results Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust the environmental parameters and click "Simulate Impact" to see predictions
                  </p>
                </div>
              </Card>
            )}

            {/* Visualization Placeholder */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Impact Visualization</h3>
              <div className="h-48 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Chart showing parameter impact on UHI
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
