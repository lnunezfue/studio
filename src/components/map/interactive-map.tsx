
"use client";

import type { Hospital } from '@/types';
import dynamic from 'next/dynamic'; // Import dynamic for react-leaflet components
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import L for custom icons
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { 
  ssr: false,
  loading: () => <div style={{ height: '400px', backgroundColor: '#e0e0e0' }} className="flex items-center justify-center rounded-lg"><p>Loading Map...</p></div>
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });


interface InteractiveMapProps {
  hospitals: Hospital[];
  className?: string;
}

// Approximate coordinates for Tacna, Peru
const TACNA_COORDS: L.LatLngExpression = [-18.0146, -70.2534];
const DEFAULT_ZOOM = 13;

export function InteractiveMap({ hospitals, className }: InteractiveMapProps) {
  // This check helps prevent rendering attempts if dynamic imports somehow haven't resolved,
  // though `ssr: false` and the loading state for MapContainer should mostly cover this.
  if (typeof window === 'undefined') {
    return <div className={className} style={{ height: '400px', backgroundColor: '#e0e0e0' }}>Initializing map...</div>;
  }

  return (
    <MapContainer center={TACNA_COORDS} zoom={DEFAULT_ZOOM} scrollWheelZoom={true} className={className} style={{ height: '400px', width: '100%' }}>
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
}
