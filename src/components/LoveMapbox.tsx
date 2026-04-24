import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/contexts/LoveTestContext';
import { supabase } from '@/integrations/supabase/client';
import { Map as MapIcon, Satellite, Heart, Mountain, Moon, Sun, Globe2, Layers } from 'lucide-react';
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

type MapStyle = 'satellite' | 'streets' | 'dark' | 'light' | 'outdoors';
type Projection = 'globe' | 'mercator';

const MAP_STYLES: Record<MapStyle, { url: string; label: string; icon: React.ReactNode }> = {
  satellite: { url: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'Satellite', icon: <Satellite className="w-3.5 h-3.5" /> },
  streets:   { url: 'mapbox://styles/mapbox/streets-v12',           label: 'Streets',   icon: <MapIcon className="w-3.5 h-3.5" /> },
  outdoors:  { url: 'mapbox://styles/mapbox/outdoors-v12',          label: 'Outdoors',  icon: <Mountain className="w-3.5 h-3.5" /> },
  light:     { url: 'mapbox://styles/mapbox/light-v11',             label: 'Light',     icon: <Sun className="w-3.5 h-3.5" /> },
  dark:      { url: 'mapbox://styles/mapbox/dark-v11',              label: 'Dark',      icon: <Moon className="w-3.5 h-3.5" /> },
};

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
  const [mapStyle, setMapStyle] = useState<MapStyle>('satellite');
  const [projection, setProjection] = useState<Projection>('globe');
  const [showStyles, setShowStyles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const userInteractingRef = useRef(false);
  const spinEnabledRef = useRef(true);

  useEffect(() => {
    location1Ref.current = location1;
    location2Ref.current = location2;
  }, [location1, location2]);

  // Initialize
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
          style: MAP_STYLES[mapStyle].url,
          projection: projection,
          zoom: 1.6,
          center: [30, 20],
          pitch: 45,
          attributionControl: false,
        });

        map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
        map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

        map.current.on('style.load', () => {
          map.current?.setFog({
            color: 'rgb(220, 200, 220)',
            'high-color': 'rgb(120, 80, 140)',
            'horizon-blend': 0.04,
            'space-color': 'rgb(20, 10, 30)',
            'star-intensity': 0.6,
          });
          drawLocations();
        });

        const secondsPerRevolution = 220;
        const maxSpinZoom = 5;
        const slowSpinZoom = 3;

        function spinGlobe() {
          if (!map.current || !spinEnabledRef.current) return;
          const zoom = map.current.getZoom();
          if (!userInteractingRef.current && zoom < maxSpinZoom) {
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

        map.current.on('mousedown', () => { userInteractingRef.current = true; });
        map.current.on('dragstart', () => { userInteractingRef.current = true; });
        map.current.on('mouseup', () => { userInteractingRef.current = false; spinGlobe(); });
        map.current.on('touchend', () => { userInteractingRef.current = false; spinGlobe(); });
        map.current.on('moveend', spinGlobe);

        map.current.on('click', (e) => {
          spinEnabledRef.current = false;
          const newLocation = { lat: e.lngLat.lat, lng: e.lngLat.lng };
          if (!location1Ref.current) {
            onLocation1Set(newLocation);
          } else if (!location2Ref.current) {
            onLocation2Set(newLocation);
          } else {
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];
            onLocation1Set(newLocation);
          }
        });

        spinGlobe();
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    initMap();
    return () => { map.current?.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Style change
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(MAP_STYLES[mapStyle].url);
  }, [mapStyle]);

  // Projection change
  useEffect(() => {
    if (!map.current) return;
    map.current.setProjection(projection);
  }, [projection]);

  const sanitizeText = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const createHeartMarker = (gradientId: string, color: string, label: string) => {
    const el = document.createElement('div');
    el.className = 'custom-heart-marker';
    const sanitizedLabel = sanitizeText(label);
    el.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <svg width="44" height="44" viewBox="0 0 24 24" stroke="#fff" stroke-width="1.5">
          <defs>
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0.7"/>
            </linearGradient>
          </defs>
          <path fill="url(#${gradientId})" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span style="
          background: ${color};
          color: white;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          margin-top: -6px;
          letter-spacing: 0.02em;
        ">${sanitizedLabel}</span>
      </div>
    `;
    return el;
  };

  const drawLocations = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Clear markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (location1Ref.current) {
      const marker = new mapboxgl.Marker({
        element: createHeartMarker('grad1', '#e91e63', name1 || 'You')
      })
        .setLngLat([location1Ref.current.lng, location1Ref.current.lat])
        .addTo(map.current);
      markersRef.current.push(marker);
    }
    if (location2Ref.current) {
      const marker = new mapboxgl.Marker({
        element: createHeartMarker('grad2', '#ff5722', name2 || 'Partner')
      })
        .setLngLat([location2Ref.current.lng, location2Ref.current.lat])
        .addTo(map.current);
      markersRef.current.push(marker);
    }

    // Draw connecting line if both
    const sourceId = 'love-line';
    const layerId = 'love-line-layer';
    if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
    if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

    if (location1Ref.current && location2Ref.current) {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [location1Ref.current.lng, location1Ref.current.lat],
              [location2Ref.current.lng, location2Ref.current.lat],
            ],
          },
        },
      });
      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#e91e63',
          'line-width': 3,
          'line-dasharray': [2, 2],
          'line-opacity': 0.85,
        },
      });

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds()
        .extend([location1Ref.current.lng, location1Ref.current.lat])
        .extend([location2Ref.current.lng, location2Ref.current.lat]);
      map.current.fitBounds(bounds, { padding: 100, duration: 1500, maxZoom: 5 });
    }
  };

  // Update markers when locations change
  useEffect(() => {
    drawLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location1, location2, name1, name2, mapStyle]);

  if (error) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl bg-muted flex items-center justify-center border border-border">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const handleSearchLocation = (location: Location, isFirst: boolean) => {
    spinEnabledRef.current = false;
    if (isFirst) onLocation1Set(location);
    else onLocation2Set(location);

    if (map.current) {
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 5,
        duration: 2000,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground font-accent">
            <Heart className="w-4 h-4" style={{ color: '#e91e63' }} />
            <span>{name1 ? `${name1}'s location` : 'Your Location'}</span>
          </div>
          <LocationSearch
            placeholder="Search city or country..."
            onLocationSelect={(loc) => handleSearchLocation(loc, true)}
            mapboxToken={mapboxToken}
            color="#e91e63"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground font-accent">
            <Heart className="w-4 h-4" style={{ color: '#ff5722' }} />
            <span>{name2 ? `${name2}'s location` : "Partner's Location"}</span>
          </div>
          <LocationSearch
            placeholder="Search city or country..."
            onLocationSelect={(loc) => handleSearchLocation(loc, false)}
            mapboxToken={mapboxToken}
            color="#ff5722"
          />
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        {/* Style switcher */}
        <div className="absolute top-4 left-4 z-10">
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setShowStyles(!showStyles)}
              className="bg-white/90 hover:bg-white text-foreground backdrop-blur-md shadow-soft border border-border h-9 rounded-full px-3 gap-2"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold font-accent">{MAP_STYLES[mapStyle].label}</span>
            </Button>
            {showStyles && (
              <div className="absolute top-11 left-0 glass border border-border rounded-2xl shadow-elegant p-2 min-w-[160px] animate-fade-up">
                {(Object.keys(MAP_STYLES) as MapStyle[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setMapStyle(key); setShowStyles(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold font-accent transition-colors ${
                      mapStyle === key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    {MAP_STYLES[key].icon}
                    {MAP_STYLES[key].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projection toggle */}
        <div className="absolute top-4 right-16 z-10">
          <Button
            size="sm"
            onClick={() => setProjection(projection === 'globe' ? 'mercator' : 'globe')}
            className="bg-white/90 hover:bg-white text-foreground backdrop-blur-md shadow-soft border border-border h-9 rounded-full px-3 gap-2"
            title={projection === 'globe' ? 'Switch to flat' : 'Switch to globe'}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold font-accent">{projection === 'globe' ? '3D' : '2D'}</span>
          </Button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-2xl z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-muted-foreground text-sm font-accent">Loading map...</p>
            </div>
          </div>
        )}

        <div
          ref={mapContainer}
          className="w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-card border border-border"
        />
      </div>
    </div>
  );
};
