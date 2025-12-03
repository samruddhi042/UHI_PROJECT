import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Cluster {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  zoom: number;
}

interface ClusterSelectorProps {
  clusters: Cluster[];
  selectedCluster: string;
  onSelect: (clusterId: string) => void;
  onLocationSelect?: (cluster: Cluster) => void;
}

export const ClusterSelector = ({
  clusters,
  selectedCluster,
  onSelect,
  onLocationSelect,
}: ClusterSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground mb-3">Select Region</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {clusters.map((cluster) => (
          <Card
            key={cluster.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedCluster === cluster.id
                ? "border-primary border-2 bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => {
              onSelect(cluster.id);
              if (onLocationSelect) {
                onLocationSelect(cluster);
              }
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <MapPin
                  className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    selectedCluster === cluster.id ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium text-sm",
                      selectedCluster === cluster.id ? "text-primary" : "text-foreground"
                    )}
                  >
                    {cluster.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cluster.center.lat.toFixed(4)}, {cluster.center.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              {selectedCluster === cluster.id && (
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  Selected
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


