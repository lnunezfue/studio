
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
  className?: string; 
}

const TACNA_COORDS: L.LatLngExpression = [-18.0146, -70.2534];
const DEFAULT_ZOOM = 13;

// This is the component that will be dynamically imported by the page
const InteractiveMapComponent = ({ hospitals, className }: InteractiveMapProps) => {
  return (
    <MapContainer
        // The className for rounded corners, shadow, etc., and style for explicit height
        // are applied directly to MapContainer.
        className={className} 
        style={{ height: '400px', width: '100%' }} 
        center={TACNA_COORDS}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map((hospital) => {
        const position: L.LatLngExpression = hospital.geolocalizacion
          ? [hospital.geolocalizacion.lat, hospital.geolocalizacion.lng]
          : TACNA_COORDS; 

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
  );
};

InteractiveMapComponent.displayName = 'InteractiveMap';
export { InteractiveMapComponent as InteractiveMap };
