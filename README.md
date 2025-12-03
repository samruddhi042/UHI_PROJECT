# Urban Heat Island (UHI) Monitoring & Prediction System

A comprehensive web application for monitoring, predicting, and mitigating Urban Heat Island effects across Maharashtra, India.

## 🎯 Project Overview

This system provides:
- **Interactive Heat Maps** with real-time UHI data visualization
- **AI-Powered Predictions** for 1-day, 7-day, and 30-day forecasts
- **Mitigation Strategy Recommendations** based on area characteristics
- **Comprehensive Reporting** with PDF generation (client-side and server-side)
- **Data Export** capabilities (CSV)

## 📁 Project Structure

```
UHI_PROJECT/
├── UHI_MAHARASHTRA_ensemble/    # Backend (FastAPI)
│   ├── src/
│   │   ├── main.py              # Main API endpoints
│   │   ├── features.py           # Feature computation utilities
│   │   └── ...
│   ├── models/merged/            # Trained ML models
│   ├── data/                     # Training and processed data
│   └── requirements.txt
│
└── mahar-heat-insight-main/      # Frontend (React + Vite)
    ├── src/
    │   ├── pages/               # Page components
    │   ├── components/          # UI components
    │   ├── lib/
    │   │   └── api.ts           # API client
    │   └── ...
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** and npm/yarn (for frontend)
- **System dependencies for WeasyPrint** (optional, for server-side PDF):
  - Windows: Install GTK3 runtime
  - Linux: `sudo apt-get install python3-cffi python3-brotli libpango-1.0-0 libpangoft2-1.0-0`
  - macOS: `brew install cairo pango gdk-pixbuf libffi`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd UHI_MAHARASHTRA_ensemble
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/macOS
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables** (optional):
   ```bash
   # Create .env file (see .env.example)
   UHI_DEFAULT_CITY=Pune
   WEATHER_API_KEY=your_key_here
   ENABLE_SERVER_PDF=true
   ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/api/health`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd mahar-heat-insight-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set environment variables** (optional):
   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at `http://localhost:8080` (or port shown in terminal)

## 📋 API Endpoints

### Data & Geocoding

- `GET /api/data` - Get UHI data for an area (bbox or lat/lng + radius)
- `GET /api/geocode?q=<query>` - Geocode location using Nominatim
- `GET /api/health` - Health check
- `GET /api/config` - Frontend configuration

### Predictions

- `POST /api/predict` - Time-series predictions (1/7/30 days)
  ```json
  {
    "area": {"center": {"lat": 18.5204, "lng": 73.8567}},
    "horizon": 7,
    "cluster": "cluster_pune_metropolitan"
  }
  ```
- `POST /predict/single` - Single point prediction
- `POST /predict/batch` - Batch prediction from CSV

### Mitigation & Reports

- `POST /api/mitigation-strategies` - Get AI recommendations
- `POST /api/report` - Generate PDF report (server-side, falls back to client-side)

## 🎨 Features

### Interactive Map Explorer
- **OpenStreetMap tiles** (free, no API key required)
- **Search functionality** with geocoding
- **Layer controls** (Temperature, Humidity, UHI Intensity, Vegetation)
- **Click-to-view details** for data points
- **CSV export** of loaded data

### Prediction Module
- **Single point predictions** with manual input
- **Time-series forecasts** (1, 7, or 30 days)
- **Interactive charts** (Recharts) showing:
  - UHI intensity over time
  - Temperature trends
  - Heatwave probability
- **Batch CSV upload** for multiple predictions

### AI Mitigation Strategies
- **Area-specific recommendations** based on:
  - UHI intensity
  - NDVI (vegetation index)
  - Built-up area percentage
- **Categorized strategies**:
  - Green Infrastructure
  - Building Materials
  - Urban Planning
  - Climate Adaptation
- **Priority-based ranking**

### Reporting
- **Client-side PDF** (html2canvas + jsPDF) - always available
- **Server-side PDF** (WeasyPrint) - optional, better quality
- **Automatic fallback** if server-side PDF unavailable
- **Includes**: Data summary, predictions, strategies, charts

## 🔧 Configuration

### Backend Environment Variables

```env
UHI_DEFAULT_CITY=Pune
WEATHER_API_KEY=your_key_here  # Optional
ENABLE_SERVER_PDF=true
API_BASE_URL=http://localhost:8000
```

### Frontend Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📊 Data Sources

- **Synthetic data** generated from coordinates (for demo)
- **Trained ML models** for predictions (7 regional clusters)
- **OpenStreetMap/Nominatim** for geocoding
- **Real data** can be integrated via CSV upload

## 🧪 Testing

### Manual Acceptance Checklist

- [ ] **Backend starts** on `http://localhost:8000` without errors
- [ ] **Frontend starts** on `http://localhost:8080` without errors
- [ ] **Map loads** with OpenStreetMap tiles
- [ ] **Search bar** finds a city via `/api/geocode` and pans the map
- [ ] **"Load Data"** fetches and displays layers from `/api/data`
- [ ] **"Run Prediction"** hits `/api/predict` and updates charts
- [ ] **Clicking map area** shows local temperature, UHI, land cover, green cover
- [ ] **AI mitigation strategies** are shown for a selected area
- [ ] **"Download Report"** produces a PDF:
  - Server-side if WeasyPrint is available
  - Client-side fallback if not
- [ ] **"Export CSV"** downloads a CSV of currently loaded data
- [ ] **Login page** accepts any credentials (demo mode)
- [ ] **Charts display** correctly with prediction data

### API Health Check

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "models_loaded": true,
  "clusters": ["cluster_pune_metropolitan", ...],
  "timestamp": "2024-..."
}
```

## 📝 Notes

### PDF Generation Trade-offs

**Client-side (html2canvas + jsPDF):**
- ✅ No server dependencies
- ✅ Always available
- ❌ Less consistent layout
- ❌ May have rendering issues with complex layouts

**Server-side (WeasyPrint):**
- ✅ Better typographic quality
- ✅ More control over layout
- ✅ Can handle large datasets better
- ❌ Requires system dependencies (Cairo, Pango, etc.)
- ❌ May not be available on all systems

The system automatically falls back to client-side if server-side fails.

### Feature Computation

The backend generates synthetic features from lat/lng/month when full feature data is not available. In production, you would:
- Use actual satellite data (NDVI, LST)
- Integrate weather APIs
- Use land use databases
- Access population density data

### Model Clusters

The system supports 7 regional clusters:
1. `cluster_pune_metropolitan`
2. `cluster_mmr` (Mumbai Metro Region)
3. `cluster_nagpur_wardha`
4. `cluster_nashik_ahmednagar`
5. `cluster_solapur_sangli`
6. `cluster_aurangabad_jalna`
7. `cluster_kolhapur_ichalkaranji`

## 🐛 Troubleshooting

### Backend Issues

**Models not loading:**
- Check that `models/merged/` directory contains `.joblib` files
- Verify model naming: `cluster_<name>__<target>.joblib`

**WeasyPrint errors:**
- Install system dependencies (see Prerequisites)
- Or disable server-side PDF (frontend will use client-side)

**CORS errors:**
- Ensure frontend URL is in `origins` list in `src/main.py`
- Check that backend is running on port 8000

### Frontend Issues

**Map not loading:**
- Check browser console for Leaflet CSS errors
- Verify `leaflet` and `react-leaflet` are installed
- Clear browser cache

**API calls failing:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check that backend is running
- Check browser console for CORS errors

**PDF generation fails:**
- Check browser console for errors
- Try server-side PDF endpoint directly
- Ensure html2canvas and jspdf are installed

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [Recharts Documentation](https://recharts.org/)
- [WeasyPrint Documentation](https://weasyprint.org/)

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Team/Name Here]

---

**Built with ❤️ for Urban Heat Island research and mitigation**


