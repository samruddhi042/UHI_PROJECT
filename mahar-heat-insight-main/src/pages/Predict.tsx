import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, Loader2, Download, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api, Prediction } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import Papa from "papaparse";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const clusterOptions = [
  { label: "Aurangabad - Jalna", value: "cluster_aurangabad_jalna" },
  { label: "Kolhapur - Ichalkaranji", value: "cluster_kolhapur_ichalkaranji" },
  { label: "MMR (Mumbai Metro Region)", value: "cluster_mmr" },
  { label: "Nagpur - Wardha", value: "cluster_nagpur_wardha" },
  { label: "Nashik - Ahmednagar", value: "cluster_nashik_ahmednagar" },
  { label: "Pune (Metropolitan)", value: "cluster_pune_metropolitan" },
  { label: "Solapur - Sangli", value: "cluster_solapur_sangli" },
];

const Predict = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<any[] | null>(null);
  const [timeSeriesPredictions, setTimeSeriesPredictions] = useState<Prediction[] | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string>(clusterOptions[0].value);
  const [horizon, setHorizon] = useState<number>(7);
  const [lat, setLat] = useState<string>("18.5204");
  const [lng, setLng] = useState<string>("73.8567");
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const { toast } = useToast();

  // Batch upload -> POST /predict/batch
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Parse CSV on client side first
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const data = results.data as any[];
          setUploadedData(data);

          // Upload to backend for prediction
          const form = new FormData();
          form.append("file", file);

          const res = await fetch(`${API_BASE}/predict/batch`, {
            method: "POST",
            body: form,
          });

          if (!res.ok) {
            let errMsg = `Upload failed (${res.status})`;
            try {
              const j = await res.json();
              errMsg = j.detail || JSON.stringify(j);
            } catch {
              // ignore parse errors
            }
            throw new Error(errMsg);
          }

          const json = await res.json();
          const preds = json.predictions || json;
          setPredictions(preds);
          toast({
            title: "Predictions Complete",
            description: `Batch predictions returned (${Array.isArray(preds) ? preds.length : "?"})`,
          });
          setIsUploading(false);
        },
        error: (error) => {
          toast({
            title: "CSV Parse Error",
            description: error.message,
            variant: "destructive",
          });
          setIsUploading(false);
        },
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Batch prediction failed",
        variant: "destructive",
      });
      setIsUploading(false);
    }
    (event.target as HTMLInputElement).value = "";
  };

  // Time-series prediction -> POST /api/predict
  const handleTimeSeriesPredict = async () => {
    if (!lat || !lng) {
      toast({
        title: "Missing fields",
        description: "Please provide latitude and longitude",
        variant: "destructive",
      });
      return;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      toast({
        title: "Invalid values",
        description: "Latitude and longitude must be numbers",
        variant: "destructive",
      });
      return;
    }

    setIsPredicting(true);
    try {
      const result = await api.predict({
        area: { center: { lat: latNum, lng: lngNum } },
        horizon: horizon,
        cluster: selectedCluster,
      });
      setTimeSeriesPredictions(result.predictions);
      toast({
        title: "Prediction Complete",
        description: `Generated ${result.predictions.length} day forecast`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Prediction failed",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Single predict -> POST /predict/single
  const handleSinglePredict = async () => {
    if (!lat || !lng || !month) {
      toast({
        title: "Missing fields",
        description: "Please provide latitude, longitude and month",
        variant: "destructive",
      });
      return;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);
    const monthNum = Number(month);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum) || Number.isNaN(monthNum)) {
      toast({
        title: "Invalid values",
        description: "Latitude, longitude and month must be numbers",
        variant: "destructive",
      });
      return;
    }

    setIsPredicting(true);
    try {
      const payload = {
        cluster: selectedCluster,
        latitude: latNum,
        longitude: lngNum,
        month: monthNum,
      };

      const res = await fetch(`${API_BASE}/predict/single`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let err = `Prediction failed (${res.status})`;
        try {
          const j = await res.json();
          err = j.detail || JSON.stringify(j);
        } catch {}
        throw new Error(err);
      }

      const json = await res.json();
      const out = json.predictions || {};

      const row = {
        cluster: json.cluster || selectedCluster,
        lat: latNum,
        lon: lngNum,
        uhi: out.UHI_Intensity_C ?? null,
        health_risk: out.Health_Risk_Index ?? null,
      };

      setPredictions([row]);
      toast({
        title: "Prediction Complete",
        description: `UHI: ${row.uhi ?? "N/A"}°C, Health risk: ${row.health_risk ?? "N/A"}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Prediction failed",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Download CSV of predictions
  const handleDownload = () => {
    if (!predictions || predictions.length === 0) return;
    const headers = ["cluster", "latitude", "longitude", "UHI_Intensity_C", "Health_Risk_Index"];
    const rows = predictions.map((p) =>
      [
        p.cluster ?? "",
        p.latitude ?? p.lat ?? "",
        p.longitude ?? p.lon ?? "",
        p.uhi ?? p.UHI_Intensity_C ?? "",
        p.health_risk ?? p.Health_Risk_Index ?? "",
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">UHI Prediction</h1>
          <p className="text-muted-foreground">
            Upload CSV data or input coordinates to predict Urban Heat Island intensity and health impact
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* CSV Upload */}
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Batch Prediction (CSV)
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with latitude, longitude, and month columns
              </p>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-smooth">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="text-foreground font-medium mb-1">Click to upload or drag and drop</div>
                  <div className="text-sm text-muted-foreground">CSV file (MAX. 10MB)</div>
                </label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
            </div>
          </Card>

          {/* Manual Input */}
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Prediction Input
              </h2>
              <p className="text-sm text-muted-foreground">Enter coordinates for prediction</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cluster">Cluster</Label>
                <select
                  id="cluster"
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  {clusterOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" type="number" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="18.5204" step="0.0001" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" type="number" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="73.8567" step="0.0001" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month (1-12)</Label>
                  <Input id="month" type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="6" min="1" max="12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horizon">Prediction Horizon (days)</Label>
                  <select
                    id="horizon"
                    value={horizon}
                    onChange={(e) => setHorizon(Number(e.target.value))}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value={1}>1 day</option>
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSinglePredict} disabled={isPredicting} className="flex-1">
                  {isPredicting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Single Predict
                    </>
                  )}
                </Button>
                <Button onClick={handleTimeSeriesPredict} disabled={isPredicting} className="flex-1" variant="secondary">
                  {isPredicting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Time Series
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Time Series Charts */}
        {timeSeriesPredictions && timeSeriesPredictions.length > 0 && (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Prediction Charts</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">UHI Intensity Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="uhi_intensity" stroke="#dc2626" name="UHI Intensity (°C)" />
                    <Line type="monotone" dataKey="temperature" stroke="#f97316" name="Temperature (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Heatwave Probability</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeSeriesPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="heatwave_probability" fill="#facc15" name="Heatwave Probability (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        )}

        {/* Results Table */}
        {predictions && (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Prediction Results</h2>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Cluster</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Latitude</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Longitude</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">UHI Intensity (°C)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Health Risk Index</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-smooth">
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{pred.cluster}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{pred.latitude ?? pred.lat}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{pred.longitude ?? pred.lon}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 bg-destructive/10 text-destructive rounded font-medium">
                          {pred.uhi ?? pred.UHI_Intensity_C ?? "N/A"}°C
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded font-medium">
                          {pred.health_risk ?? pred.Health_Risk_Index ?? "N/A"}/10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Predict;
