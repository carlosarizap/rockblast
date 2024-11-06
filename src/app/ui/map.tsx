import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Node } from '../lib/definitions/node';

// Replace this with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export function Map() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        // Fetch nodes from the API
        const fetchNodes = async () => {
            try {
                const response = await fetch('/api/nodes');
                const data = await response.json();
                setNodes(data);
            } catch (error) {
                console.error('Error fetching nodes:', error);
            }
        };

        fetchNodes();
    }, []);

    useEffect(() => {
        if (mapRef.current && nodes.length > 0) {
            // Create the map using Mapbox GL JS
            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center:  [-69.08341, -24.254059],
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
                const markerElement = document.createElement('div');
                markerElement.style.width = '15px';
                markerElement.style.height = '15px';
                markerElement.style.backgroundColor = 'blue';
                markerElement.style.borderRadius = '50%';
                markerElement.style.border = '2px solid black';

                new mapboxgl.Marker(markerElement)
                    .setLngLat([node.nod_coord_este, node.nod_coord_norte] as LngLatLike)
                    .setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setText(`Nodo: ${node.nod_nombre}`))
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
