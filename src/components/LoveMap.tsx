import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/contexts/LoveTestContext';

interface LoveMapProps {
  location1: Location | null;
  location2: Location | null;
  name1: string;
  name2: string;
  onLocation1Set: (location: Location) => void;
  onLocation2Set: (location: Location) => void;
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const createHeartIcon = (color: string, label: string) => {
  const safeLabel = escapeHtml(label);
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: none;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span style="
          position: absolute;
          bottom: -20px;
          background: ${color};
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        ">${safeLabel}</span>
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 40],
  });
};

export const LoveMap: React.FC<LoveMapProps> = ({
  location1,
  location2,
  name1,
  name2,
  onLocation1Set,
  onLocation2Set,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const location1Ref = useRef(location1);
  const location2Ref = useRef(location2);

  // Keep refs updated
  useEffect(() => {
    location1Ref.current = location1;
    location2Ref.current = location2;
  }, [location1, location2]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([30, 0], 2);
    
    // Satellite base layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    }).addTo(map);

    // Labels overlay for country/city names
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
      subdomains: 'abcd',
      pane: 'overlayPane'
    }).addTo(map);

    map.on('click', (e) => {
      const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (!location1Ref.current) {
        onLocation1Set(newLocation);
      } else if (!location2Ref.current) {
        onLocation2Set(newLocation);
      } else {
        // Reset - clear both locations and start fresh
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        onLocation1Set(newLocation);
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocation1Set, onLocation2Set]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (location1) {
      const marker = L.marker([location1.lat, location1.lng], {
        icon: createHeartIcon('#e91e63', name1 || 'You')
      }).addTo(mapRef.current);
      markersRef.current.push(marker);
    }

    if (location2) {
      const marker = L.marker([location2.lat, location2.lng], {
        icon: createHeartIcon('#ff5722', name2 || 'Partner')
      }).addTo(mapRef.current);
      markersRef.current.push(marker);
    }
  }, [location1, location2, name1, name2]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-card border border-border"
    />
  );
};
