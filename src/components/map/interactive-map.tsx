"use client";

import React from 'react';
import type { Hospital } from '@/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

// Default Leaflet icon fix
const defaultIcon = new L.Icon({
  iconUrl: '/leaflet/marker-icon.png', // Ensure these files are in /public/leaflet/
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const TACNA_COORDS: [number, number] = [-18.0146, -70.2536];
const DEFAULT_ZOOM = 13;

interface InteractiveMapProps {
  hospitals: Hospital[];
  className?: string;
  style?: React.CSSProperties;
}

export default function InteractiveMap({ hospitals, className, style }: InteractiveMapProps) {
  if (typeof window === 'undefined') {
    // This check helps prevent trying to render Leaflet components on the server.
    // The dynamic import with ssr:false on the page should mostly handle this,
    // but this is an additional safeguard.
    return <div className={className} style={style || { height: '400px', width: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>;
  }

  return (
    <MapContainer
      className={className}
      style={style || { height: '400px' }}
      center={TACNA_COORDS}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      id="hospitals-map-leaflet-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map(hospital => (
        hospital.geolocalizacion && (
          <Marker
            key={hospital.id}
            position={[hospital.geolocalizacion.lat, hospital.geolocalizacion.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <strong>{hospital.nombre}</strong><br />
              {hospital.direccion}<br />
              <Link href={`/hospitals/${hospital.id}`} passHref>
                <span className="text-primary hover:underline cursor-pointer">
                  View Details
                </span>
              </Link>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
