
"use client";

import React from 'react';
import type { Hospital } from '@/types';
import L from 'leaflet';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Define a default icon instance to avoid global prototype mutation
const defaultIcon = new L.Icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface InteractiveMapProps {
  hospitals: Hospital[];
  className?: string; // For styling the wrapper div (e.g., rounded corners, shadow)
}

const TACNA_COORDS: L.LatLngExpression = [-18.0146, -70.2534];
const DEFAULT_ZOOM = 13;

// This is the component that will be dynamically imported by the page
const InteractiveMapComponent = React.memo(function InteractiveMap({ hospitals, className }: InteractiveMapProps) {
  return (
    // This wrapper div gets the className for styling (e.g. rounded, shadow)
    // and explicitly sets the dimensions for the map area.
    <div className={className} style={{ height: '400px', width: '100%' }}>
      <MapContainer
          id="hospitals-map-leaflet-container" // Static ID for the map container
          center={TACNA_COORDS}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }} // MapContainer fills the wrapper
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hospitals.map((hospital) => {
          const position: L.LatLngExpression = hospital.geolocalizacion
            ? [hospital.geolocalizacion.lat, hospital.geolocalizacion.lng]
            : TACNA_COORDS; // Fallback, though ideally all hospitals have coords

          return (
            <Marker key={hospital.id} position={position} icon={defaultIcon}>
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
    </div>
  );
});

InteractiveMapComponent.displayName = 'InteractiveMap';

export { InteractiveMapComponent as InteractiveMap };
