
"use client";

import { GoogleMap, MarkerF, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import React, { useState, useCallback } from 'react';
import type { Hospital } from '@/types';
import Link from 'next/link';
import { Button } from '../ui/button';

const TACNA_COORDS = { lat: -18.0146, lng: -70.2536 };
const DEFAULT_ZOOM = 13;

interface InteractiveMapProps {
  hospitals: Hospital[];
  className?: string; // For the outer container styling (e.g., rounded corners, shadow)
  style?: React.CSSProperties; // For the outer container explicit style (e.g., height)
}

// Base style for the GoogleMap component itself to fill its parent
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function InteractiveMap({ hospitals, className, style }: InteractiveMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    // libraries: ['places'], // Uncomment if you need the Places library
  });

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const onMarkerClick = useCallback((hospital: Hospital) => {
    setSelectedHospital(hospital);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setSelectedHospital(null);
  }, []);

  if (loadError) {
    return (
      <div className={className} style={style}>
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <p className="text-destructive-foreground font-semibold">Error loading Google Maps.</p>
          <p className="text-sm text-muted-foreground">Please ensure your API key is correctly configured and has the Maps JavaScript API enabled.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    // This loading state is primarily handled by the `loading` prop of `next/dynamic`
    // when this component is dynamically imported. This is a fallback.
    return (
      <div className={className} style={style}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading Google Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}> {/* Outer div handles sizing and custom classes */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={TACNA_COORDS}
        zoom={DEFAULT_ZOOM}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {hospitals.map(hospital => (
          hospital.geolocalizacion && (
            <MarkerF
              key={hospital.id}
              position={{ lat: hospital.geolocalizacion.lat, lng: hospital.geolocalizacion.lng }}
              onClick={() => onMarkerClick(hospital)}
              title={hospital.nombre}
            />
          )
        ))}

        {selectedHospital && selectedHospital.geolocalizacion && (
          <InfoWindow
            position={{ lat: selectedHospital.geolocalizacion.lat, lng: selectedHospital.geolocalizacion.lng }}
            onCloseClick={onInfoWindowClose}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }} // Adjust InfoWindow position
          >
            <div className="p-2 space-y-1 max-w-xs">
              <h4 className="font-semibold text-base text-popover-foreground">{selectedHospital.nombre}</h4>
              <p className="text-xs text-muted-foreground">{selectedHospital.direccion}</p>
              <Button variant="link" asChild className="p-0 h-auto text-xs text-primary">
                <Link href={`/hospitals/${selectedHospital.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
