import React, { Suspense, lazy } from 'react';
import { Location } from '@/contexts/LoveTestContext';

interface LoveMapProps {
  location1: Location | null;
  location2: Location | null;
  name1: string;
  name2: string;
  onLocation1Set: (location: Location) => void;
  onLocation2Set: (location: Location) => void;
}

const LoveMap = lazy(() => import('./LoveMap').then(module => ({ default: module.LoveMap })));

const MapLoadingPlaceholder = () => (
  <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-card border border-border bg-muted/30 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
      <p className="text-muted-foreground text-sm">Loading map...</p>
    </div>
  </div>
);

export const LazyLoveMap: React.FC<LoveMapProps> = (props) => {
  return (
    <Suspense fallback={<MapLoadingPlaceholder />}>
      <LoveMap {...props} />
    </Suspense>
  );
};

export default LazyLoveMap;
