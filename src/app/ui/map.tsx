import React, { useEffect, useRef } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Node } from '../lib/definitions/node';

// Replace this with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapProps {
    nodes: Node[];
}

export function Map({ nodes }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    // Helper function to determine marker styles based on risk level
    const getMarkerStyles = (riskLevel: string) => {
        switch (riskLevel.toLowerCase()) {
            case 'normal':
                return { backgroundColor: 'green', borderColor: 'darkgreen' };
            case 'riesgo':
                return { backgroundColor: 'orange', borderColor: 'darkorange' };
            case 'alto riesgo':
                return { backgroundColor: 'red', borderColor: 'darkred' };
            default:
                return { backgroundColor: 'gray', borderColor: 'darkgray' }; // Default for unknown levels
        }
    };

    useEffect(() => {
        if (mapRef.current && nodes.length > 0) {
            // Create the map using Mapbox GL JS
            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [-69.08341, -24.254059],
                zoom: 14,
                pitch: 60,
                bearing: 270,
                antialias: true,
            });

            map.on('load', () => {
                map.addSource('mapbox-dem', {
                    type: 'raster-dem',
                    url: 'mapbox://mapbox.terrain-rgb',
                    tileSize: 512,
                    maxzoom: 14,
                });
                map.setTerrain({ source: 'mapbox-dem' });

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

            map.addControl(new mapboxgl.NavigationControl());

            // Add markers for each node
            nodes.forEach((node) => {
                const { backgroundColor, borderColor } = getMarkerStyles(node.nivan_nombre);

                const markerElement = document.createElement('div');
                markerElement.style.width = '30px';
                markerElement.style.height = '30px';
                markerElement.style.backgroundColor = backgroundColor;
                markerElement.style.borderRadius = '50%';
                markerElement.style.border = `3px solid ${borderColor}`;

                // Add text label for node name inside the marker
                markerElement.style.display = 'flex';
                markerElement.style.alignItems = 'center';
                markerElement.style.justifyContent = 'center';
                markerElement.style.color = 'white';
                markerElement.style.fontSize = '10px';
                markerElement.style.fontWeight = 'bold';

                markerElement.textContent = node.nod_nombre;

                new mapboxgl.Marker(markerElement)
                    .setLngLat([node.nod_coord_este, node.nod_coord_norte] as LngLatLike)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 })
                            .setHTML(`
                                <div>
                                    <strong>Pozo:</strong> ${node.nod_nombre}<br>
                                    <strong>Estado:</strong> ${node.nivan_nombre}<br>
                                    <strong>Cota Crítica:</strong> ${node.cota_critica}<br>
                                    <strong>Coordenadas:</strong> (${node.nod_coord_este}, ${node.nod_coord_norte})
                                </div>
                            `)
                    )
                    .addTo(map);
            });

            return () => map.remove(); // Clean up on unmount
        }
    }, [nodes]);

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
