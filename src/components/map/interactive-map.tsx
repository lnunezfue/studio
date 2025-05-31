
"use client";

import React from 'react'; // Import React for React.memo
import type { Hospital } from '@/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix for default Leaflet marker icon issue
// For more details, see: https://github.com/PaulLeCam/react-leaflet/issues/808
// Or: https://github.com/Leaflet/Leaflet/issues/4968
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface InteractiveMapProps {
  hospitals: Hospital[];
  className?: string;
}

const TACNA_COORDS: L.LatLngExpression = [-18.0146, -70.2534];
const DEFAULT_ZOOM = 13;

// Define mapStyle outside the component or use useMemo for stability
const mapStyle: React.CSSProperties = { height: '400px', width: '100%' };

// Wrap the functional component with React.memo
const InteractiveMapComponent = React.memo(function InteractiveMap({ hospitals, className }: InteractiveMapProps) {
  return (
    <MapContainer 
        center={TACNA_COORDS} 
        zoom={DEFAULT_ZOOM} 
        scrollWheelZoom={true} 
        className={className} 
        style={mapStyle} // Use the stable style object
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map((hospital) => {
        const position: L.LatLngExpression = hospital.geolocalizacion 
          ? [hospital.geolocalizacion.lat, hospital.geolocalizacion.lng]
          : TACNA_COORDS; // Fallback to Tacna center if no geolocation

        return (
          <Marker key={hospital.id} position={position}>
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{hospital.nombre}</h3>
                <p className="text-xs text-muted-foreground">{hospital.direccion}</p>
                <Button asChild variant="link" size="sm" className="p-0 h-auto text-xs">
                  <Link href={`/hospitals/${hospital.id}`}>View Details</Link>
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
});

InteractiveMapComponent.displayName = 'InteractiveMap'; // Optional: for better debugging names

// Export the memoized component
export { InteractiveMapComponent as InteractiveMap };

