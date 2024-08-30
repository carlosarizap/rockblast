"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace this with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export function Map() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef.current) {
            // Create the map using Mapbox GL JS
            const map = new mapboxgl.Map({
                container: mapRef.current, // Container ID
                style: 'mapbox://styles/mapbox/satellite-v9', // Mapbox Satellite style URL
                center: [-69.07215409231613, -24.269798502643763], // Initial position [lng, lat]
                zoom: 14, // Initial zoom level
                pitch: 70, // Pitch the map for a 3D effect
                bearing: 90, // Rotate the map
                antialias: true, // Improve the rendering quality of the map
            });

            // Add 3D terrain
            map.on('load', () => {
                map.addSource('mapbox-dem', {
                    type: 'raster-dem',
                    url: 'mapbox://mapbox.terrain-rgb',
                    tileSize: 512,
                    maxzoom: 14,
                });
                map.setTerrain({ source: 'mapbox-dem' });

                // Add sky layer for a more immersive experience
                map.addLayer({
                    id: 'sky',
                    type: 'sky',
                    paint: {
                        'sky-type': 'atmosphere',
                        'sky-atmosphere-sun': [0.0, 0.0],
                        'sky-atmosphere-sun-intensity': 15,
                    },
                });
            });

            // Add navigation control (zoom buttons + compass)
            map.addControl(new mapboxgl.NavigationControl());

            // Coordinates for the markers
            const markerCoordinates: [number, number][] = [
                [-69.0834131270831, -24.2540593234207],
                [-69.0838175921978, -24.2639819294326], 
                [-69.0840638601929, -24.2544289147602], 
                [-69.0864741399838, -24.2563244426373], 
      
            ];

            // Add markers to the map
            markerCoordinates.forEach((coords: [number, number]) => {
                new mapboxgl.Marker()
                    .setLngLat(coords as LngLatLike)
                    .addTo(map);
            });

            return () => map.remove(); // Clean up on unmount
        }
    }, []);

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                borderRadius: '15px',
                overflow: 'hidden',
            }}
            ref={mapRef}
        />
    );
}
