import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Flame, Heart, Leaf, MapPin, Search, Loader2, Download, FileSpreadsheet, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, UHIDataPoint, GeocodeResult } from "@/lib/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to handle map view changes
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

const MapExplorer = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0, 76.0]);
  const [mapZoom, setMapZoom] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dataPoints, setDataPoints] = useState<UHIDataPoint[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<UHIDataPoint | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    temperature: true,
    humidity: true,
    uhi: true,
    vegetation: true,
  });
  const [selectedArea, setSelectedArea] = useState<{ lat: number; lng: number; radius: number } | null>(null);
  const { toast } = useToast();

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const result = await api.geocode(searchQuery);
      setSearchResults(result.results);
      if (result.results.length > 0) {
        const first = result.results[0];
        setMapCenter([first.latitude, first.longitude]);
        setMapZoom(12);
        setSelectedArea({ lat: first.latitude, lng: first.longitude, radius: 5 });
      }
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message || "Could not find location",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Load data for current map view
  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const bbox = `${mapCenter[0] - 0.5},${mapCenter[1] - 0.5},${mapCenter[0] + 0.5},${mapCenter[1] + 0.5}`;
      const result = await api.getData({ bbox });
      setDataPoints(result.data);
      toast({
        title: "Data loaded",
        description: `Loaded ${result.data.length} data points`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to load data",
        description: error.message || "Could not fetch UHI data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [mapCenter, toast]);

  useEffect(() => {
    // Auto-load data when map center changes significantly
    const timer = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(timer);
  }, [mapCenter, loadData]);

  const getColorForUHI = (uhi: number) => {
    if (uhi > 12) return "#dc2626"; // red-600
    if (uhi > 8) return "#f97316"; // orange-500
    if (uhi > 5) return "#facc15"; // yellow-400
    return "#22c55e"; // green-500
  };

  const getColorForTemp = (temp: number) => {
    if (temp > 38) return "#dc2626";
    if (temp > 35) return "#f97316";
    if (temp > 30) return "#facc15";
    return "#3b82f6";
  };

  const exportCSV = () => {
    if (dataPoints.length === 0) {
      toast({
        title: "No data",
        description: "Load data first before exporting",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Latitude", "Longitude", "Temperature", "Humidity", "UHI Intensity", "Health Risk", "NDVI", "Builtup %", "Land Cover", "Green Cover %"];
    const rows = dataPoints.map((p) => [
      p.latitude,
      p.longitude,
      p.temperature,
      p.humidity,
      p.uhi_intensity,
      p.health_risk,
      p.ndvi,
      p.builtup_percent,
      p.land_cover,
      p.green_cover,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uhi_data_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "CSV exported",
      description: "Data downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
            Interactive Heat Map Explorer
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore Urban Heat Island patterns across Maharashtra with real-time data visualization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <Card className="lg:col-span-1 space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Location</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="City, area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={isSearching} size="icon">
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
                {searchResults.length > 0 && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {searchResults.map((result, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full text-left text-xs justify-start h-auto py-2"
                        onClick={() => {
                          setMapCenter([result.latitude, result.longitude]);
                          setMapZoom(12);
                          setSelectedArea({ lat: result.latitude, lng: result.longitude, radius: 5 });
                        }}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {result.display_name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Layer Toggles */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Layers</label>
                <div className="space-y-2">
                  <Button
                    variant={activeLayers.temperature ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveLayers((prev) => ({ ...prev, temperature: !prev.temperature }))}
                  >
                    <Flame className={`h-4 w-4 mr-2 ${activeLayers.temperature ? "animate-pulse" : ""}`} />
                    Temperature
                  </Button>
                  <Button
                    variant={activeLayers.humidity ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveLayers((prev) => ({ ...prev, humidity: !prev.humidity }))}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${activeLayers.humidity ? "animate-pulse" : ""}`} />
                    Humidity
                  </Button>
                  <Button
                    variant={activeLayers.uhi ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveLayers((prev) => ({ ...prev, uhi: !prev.uhi }))}
                  >
                    <Flame className={`h-4 w-4 mr-2 ${activeLayers.uhi ? "animate-pulse" : ""}`} />
                    UHI Intensity
                  </Button>
                  <Button
                    variant={activeLayers.vegetation ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveLayers((prev) => ({ ...prev, vegetation: !prev.vegetation }))}
                  >
                    <Leaf className={`h-4 w-4 mr-2 ${activeLayers.vegetation ? "animate-pulse" : ""}`} />
                    Vegetation
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button onClick={loadData} disabled={isLoadingData} className="w-full">
                  {isLoadingData ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Load Data
                    </>
                  )}
                </Button>
                <Button onClick={exportCSV} variant="outline" className="w-full" disabled={dataPoints.length === 0}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Container */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="overflow-hidden">
              <div style={{ height: "600px", width: "100%" }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Data Points */}
                  {dataPoints.map((point, idx) => {
                    if (!activeLayers.uhi && !activeLayers.temperature) return null;
                    const color = activeLayers.uhi
                      ? getColorForUHI(point.uhi_intensity)
                      : getColorForTemp(point.temperature);
                    return (
                      <Circle
                        key={idx}
                        center={[point.latitude, point.longitude]}
                        radius={500}
                        pathOptions={{
                          color: color,
                          fillColor: color,
                          fillOpacity: 0.3,
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => setSelectedPoint(point),
                        }}
                      >
                        <Popup>
                          <div className="p-2 space-y-1 text-sm">
                            <p className="font-bold">UHI Data Point</p>
                            <p>Temp: {point.temperature.toFixed(1)}°C</p>
                            <p>UHI: {point.uhi_intensity.toFixed(2)}°C</p>
                            <p>Humidity: {point.humidity.toFixed(1)}%</p>
                            <p>NDVI: {point.ndvi.toFixed(3)}</p>
                            <p>Built-up: {point.builtup_percent.toFixed(1)}%</p>
                          </div>
                        </Popup>
                      </Circle>
                    );
                  })}

                  {/* Selected Area Marker */}
                  {selectedArea && (
                    <Marker position={[selectedArea.lat, selectedArea.lng]}>
                      <Popup>
                        <div className="p-2">
                          <p className="font-bold">Selected Area</p>
                          <p>Lat: {selectedArea.lat.toFixed(4)}</p>
                          <p>Lng: {selectedArea.lng.toFixed(4)}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </Card>

            {/* Selected Point Details */}
            {selectedPoint && (
              <Card>
                <CardHeader>
                  <CardTitle>Point Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold">{selectedPoint.temperature.toFixed(1)}°C</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">UHI Intensity</p>
                      <p className="text-2xl font-bold">{selectedPoint.uhi_intensity.toFixed(2)}°C</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Humidity</p>
                      <p className="text-2xl font-bold">{selectedPoint.humidity.toFixed(1)}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Health Risk</p>
                      <p className="text-2xl font-bold">{selectedPoint.health_risk.toFixed(1)}/10</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">NDVI</p>
                      <p className="text-lg font-semibold">{selectedPoint.ndvi.toFixed(3)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Built-up %</p>
                      <p className="text-lg font-semibold">{selectedPoint.builtup_percent.toFixed(1)}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Land Cover</p>
                      <Badge>{selectedPoint.land_cover}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Green Cover</p>
                      <p className="text-lg font-semibold">{selectedPoint.green_cover.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
