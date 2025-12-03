import { Link } from "react-router-dom";
import { Thermometer } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Thermometer className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">UHI Maharashtra</div>
                <div className="text-xs text-muted-foreground">Climate Analytics</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced Urban Heat Island monitoring and prediction for Maharashtra's regional clusters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/map" className="text-muted-foreground hover:text-primary transition-smooth">
                  Map Explorer
                </Link>
              </li>
              <li>
                <Link to="/predict" className="text-muted-foreground hover:text-primary transition-smooth">
                  Predict UHI
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-smooth">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="text-muted-foreground hover:text-primary transition-smooth">
                  Scenario Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/recommendations" className="text-muted-foreground hover:text-primary transition-smooth">
                  Recommendations
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  About Project
                </a>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Partners</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Powered by advanced machine learning and geospatial analytics.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground">
                ML Ensemble
              </div>
              <div className="px-3 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground">
                GeoSpatial AI
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 UHI Maharashtra Climate Analytics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
