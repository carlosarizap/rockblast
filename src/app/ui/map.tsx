'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace this with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const piezometers = [
    { id: 'D2300', coordinates: [-69.0705, -24.2758], level: 'ALTO', color: 'red' },
    { id: 'D2301', coordinates: [-69.0745, -24.2731], level: 'ALTO', color: 'red' },
    { id: 'D2302', coordinates: [-69.0760, -24.2762], level: 'MEDIO', color: 'yellow' },
    { id: 'D2303', coordinates: [-69.0685, -24.2770], level: 'MEDIO', color: 'yellow' },
    { id: 'D2304', coordinates: [-69.0755, -24.2720], level: 'BAJO', color: 'green' },
    { id: 'D2305', coordinates: [-69.0690, -24.2725], level: 'BAJO', color: 'green' },
    { id: 'D2306', coordinates: [-69.0725, -24.2710], level: 'BAJO', color: 'green' },
    { id: 'D2307', coordinates: [-69.0740, -24.2775], level: 'ALTO', color: 'red' },
    { id: 'D2308', coordinates: [-69.0705, -24.2738], level: 'MEDIO', color: 'yellow' },
    { id: 'D2309', coordinates: [-69.0732, -24.2705], level: 'BAJO', color: 'green' },
    { id: 'D2310', coordinates: [-69.0765, -24.2748], level: 'ALTO', color: 'red' },
    { id: 'D2311', coordinates: [-69.0695, -24.2780], level: 'MEDIO', color: 'yellow' },
  ];
  
  

export function Map() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef.current) {
            // Create the map using Mapbox GL JS
            const map = new mapboxgl.Map({
                container: mapRef.current, // Container ID
                style: 'mapbox://styles/mapbox/satellite-v9', // Mapbox Satellite style URL
                center:  [-69.0690, -24.2725], // Initial position [lng, lat]
                zoom: 14, // Initial zoom level
                pitch: 60, // Pitch the map for a 3D effect
                bearing: 180, // Rotate the map
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

            // Add markers to the map with different colors depending on the level
            piezometers.forEach((piezometer) => {
                // Create a custom HTML element for each marker
                const markerElement = document.createElement('div');
                markerElement.style.width = '20px';
                markerElement.style.height = '20px';
                markerElement.style.backgroundColor = piezometer.color;
                markerElement.style.borderRadius = '50%';
                markerElement.style.border = '2px solid black';
                
                new mapboxgl.Marker(markerElement)
                    .setLngLat(piezometer.coordinates as LngLatLike)
                    .setPopup(new mapboxgl.Popup({ offset: 25 }) // Add popups with information
                        .setText(`Piezómetro ${piezometer.id} - Nivel: ${piezometer.level}`))
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
