import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/contexts/LoveTestContext';
import { supabase } from '@/integrations/supabase/client';
import { Map, Satellite, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationSearch } from './LocationSearch';

interface LoveMapboxProps {
  location1: Location | null;
  location2: Location | null;
  name1: string;
  name2: string;
  onLocation1Set: (location: Location) => void;
  onLocation2Set: (location: Location) => void;
}

export const LoveMapbox: React.FC<LoveMapboxProps> = ({
  location1,
  location2,
  name1,
  name2,
  onLocation1Set,
  onLocation2Set,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const location1Ref = useRef(location1);
  const location2Ref = useRef(location2);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('satellite');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  // Keep refs updated
  useEffect(() => {
    location1Ref.current = location1;
    location2Ref.current = location2;
  }, [location1, location2]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error || !data?.token) {
          setError('Failed to load map. Please try again.');
          setIsLoading(false);
          return;
        }

        setMapboxToken(data.token);
        mapboxgl.accessToken = data.token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: mapStyle === 'satellite' 
            ? 'mapbox://styles/mapbox/satellite-streets-v12'
            : 'mapbox://styles/mapbox/streets-v12',
          projection: 'globe',
          zoom: 1.5,
          center: [30, 15],
          pitch: 45,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({ visualizePitch: true }),
          'top-right'
        );

        // Add atmosphere effect
        map.current.on('style.load', () => {
          map.current?.setFog({
            color: 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
          });
        });

        // Globe rotation settings
        const secondsPerRevolution = 180;
        const maxSpinZoom = 5;
        const slowSpinZoom = 3;
        let userInteracting = false;

        function spinGlobe() {
          if (!map.current) return;
          const zoom = map.current.getZoom();
          if (!userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution;
            if (zoom > slowSpinZoom) {
              const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
              distancePerSecond *= zoomDif;
            }
            const center = map.current.getCenter();
            center.lng -= distancePerSecond;
            map.current.easeTo({ center, duration: 1000, easing: (n) => n });
          }
        }

        // Interaction events
        map.current.on('mousedown', () => { userInteracting = true; });
        map.current.on('dragstart', () => { userInteracting = true; });
        map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
        map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
        map.current.on('moveend', spinGlobe);

        // Click to add markers
        map.current.on('click', (e) => {
          const newLocation = { lat: e.lngLat.lat, lng: e.lngLat.lng };
          if (!location1Ref.current) {
            onLocation1Set(newLocation);
          } else if (!location2Ref.current) {
            onLocation2Set(newLocation);
          } else {
            // Reset
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];
            onLocation1Set(newLocation);
          }
        });

        // Start rotation
        spinGlobe();
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update style when changed
  useEffect(() => {
    if (!map.current) return;
    
    const style = mapStyle === 'satellite' 
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/streets-v12';
    
    map.current.setStyle(style);
  }, [mapStyle]);

  // Sanitize text to prevent XSS
  const sanitizeText = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Create heart marker element
  const createHeartMarker = (color: string, label: string) => {
    const el = document.createElement('div');
    el.className = 'custom-heart-marker';
    const sanitizedLabel = sanitizeText(label);
    el.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span style="
          background: ${color};
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          margin-top: -5px;
        ">${sanitizedLabel}</span>
      </div>
    `;
    return el;
  };

  // Update markers when locations change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (location1) {
      const marker = new mapboxgl.Marker({ element: createHeartMarker('#e91e63', name1 || 'You') })
        .setLngLat([location1.lng, location1.lat])
        .addTo(map.current);
      markersRef.current.push(marker);
    }

    if (location2) {
      const marker = new mapboxgl.Marker({ element: createHeartMarker('#ff5722', name2 || 'Partner') })
        .setLngLat([location2.lng, location2.lat])
        .addTo(map.current);
      markersRef.current.push(marker);
    }
  }, [location1, location2, name1, name2]);

  if (error) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-lg bg-muted flex items-center justify-center border border-border">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Handle search selection and fly to location
  const handleSearchLocation = (location: Location, isFirst: boolean) => {
    if (isFirst) {
      onLocation1Set(location);
    } else {
      onLocation2Set(location);
    }
    
    // Fly to location
    if (map.current) {
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 5,
        duration: 2000
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Boxes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Heart className="w-4 h-4 text-primary" />
            <span>Your Location</span>
          </div>
          <LocationSearch
            placeholder="Search city or country..."
            onLocationSelect={(loc) => handleSearchLocation(loc, true)}
            mapboxToken={mapboxToken}
            color="#e91e63"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Heart className="w-4 h-4 text-coral" />
            <span>Partner's Location</span>
          </div>
          <LocationSearch
            placeholder="Search city or country..."
            onLocationSelect={(loc) => handleSearchLocation(loc, false)}
            mapboxToken={mapboxToken}
            color="#ff5722"
          />
        </div>
      </div>

      <div className="relative">
        {/* Map Mode Toggle */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            size="sm"
            variant={mapStyle === 'satellite' ? 'default' : 'outline'}
            onClick={() => setMapStyle('satellite')}
            className="flex items-center gap-2"
          >
            <Satellite className="w-4 h-4" />
            Satellite
          </Button>
          <Button
            size="sm"
            variant={mapStyle === 'streets' ? 'default' : 'outline'}
            onClick={() => setMapStyle('streets')}
            className="flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            Streets
          </Button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <div 
          ref={mapContainer} 
          className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-card border border-border"
        />
      </div>
    </div>
  );
};
