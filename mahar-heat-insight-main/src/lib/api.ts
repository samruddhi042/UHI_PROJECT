/**
 * API client for UHI backend
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface GeocodeResult {
  display_name: string;
  latitude: number;
  longitude: number;
  boundingbox: number[];
  type: string;
  importance: number;
}

export interface UHIDataPoint {
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  uhi_intensity: number;
  health_risk: number;
  ndvi: number;
  builtup_percent: number;
  land_cover: string;
  green_cover: number;
  cluster: string;
  timestamp: string;
}

export interface Prediction {
  date: string;
  uhi_intensity: number | null;
  temperature: number;
  heatwave_probability: number;
  health_risk_index: number | null;
}

export interface MitigationStrategy {
  title: string;
  category: string;
  priority: string;
  explanation: string;
  impact?: string;
  cost?: string;
  feasibility?: string;
  tags?: string[];
}

export const api = {
  async geocode(query: string): Promise<{ results: GeocodeResult[]; query: string }> {
    const response = await fetch(`${API_BASE}/api/geocode?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Geocoding failed");
    return response.json();
  },

  async getData(params: {
    bbox?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    time_range?: string;
  }): Promise<{ data: UHIDataPoint[]; bbox: number[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params.bbox) searchParams.append("bbox", params.bbox);
    if (params.lat) searchParams.append("lat", params.lat.toString());
    if (params.lng) searchParams.append("lng", params.lng.toString());
    if (params.radius) searchParams.append("radius", params.radius.toString());
    if (params.time_range) searchParams.append("time_range", params.time_range);

    const response = await fetch(`${API_BASE}/api/data?${searchParams}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  },

  async predict(params: {
    area: { bbox?: number[]; center?: { lat: number; lng: number } };
    horizon: number;
    cluster?: string;
  }): Promise<{
    predictions: Prediction[];
    horizon_days: number;
    cluster: string;
    area: { lat: number; lng: number };
  }> {
    const response = await fetch(`${API_BASE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error("Prediction failed");
    return response.json();
  },

  async getMitigationStrategies(params: {
    area: { bbox?: number[]; center?: { lat: number; lng: number } };
    uhi_intensity?: number;
    ndvi?: number;
    builtup_percent?: number;
  }): Promise<{
    strategies: MitigationStrategy[];
    area: { lat: number; lng: number };
    characteristics: {
      uhi_intensity?: number;
      ndvi?: number;
      builtup_percent?: number;
    };
  }> {
    const response = await fetch(`${API_BASE}/api/mitigation-strategies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error("Failed to get strategies");
    return response.json();
  },

  async generateReport(data: {
    title: string;
    city: string;
    area: { bbox?: number[]; center?: { lat: number; lng: number } };
    data_summary: Record<string, any>;
    predictions: Prediction[];
    strategies: MitigationStrategy[];
    charts_data?: Record<string, any>;
    map_image?: string;
  }): Promise<Blob | { error: string; reason: string; fallback: string }> {
    const response = await fetch(`${API_BASE}/api/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status === 501) {
      return response.json();
    }

    if (!response.ok) throw new Error("Report generation failed");
    return response.blob();
  },

  async healthCheck(): Promise<{
    status: string;
    models_loaded: boolean;
    clusters: string[];
    timestamp: string;
  }> {
    const response = await fetch(`${API_BASE}/api/health`);
    if (!response.ok) throw new Error("Health check failed");
    return response.json();
  },

  async getConfig(): Promise<{
    default_city: string;
    default_lat: number;
    default_lon: number;
    default_zoom: number;
    server_pdf_enabled: boolean;
    api_base_url: string;
    clusters: Array<{
      id: string;
      name: string;
      center: { lat: number; lng: number };
      zoom: number;
    }>;
  }> {
    const response = await fetch(`${API_BASE}/api/config`);
    if (!response.ok) throw new Error("Config fetch failed");
    return response.json();
  },

  async login(email: string, password: string): Promise<{
    token: string;
    user: { email: string };
    expires_in: number;
  }> {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  async getAIStrategies(params: {
    area: { bbox?: number[]; center?: { lat: number; lng: number } };
    uhi_intensity?: number;
    health_risk?: number;
    ndvi?: number;
    builtup_percent?: number;
  }): Promise<{
    strategies: MitigationStrategy[];
    area: { lat: number; lng: number };
    characteristics: {
      uhi_intensity?: number;
      ndvi?: number;
      builtup_percent?: number;
    };
  }> {
    const response = await fetch(`${API_BASE}/api/ai-strategies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error("Failed to get AI strategies");
    return response.json();
  },
};

