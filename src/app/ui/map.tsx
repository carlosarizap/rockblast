"use client"

import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect } from 'react'

export function Map() {

    const mapRef = React.useRef(null);

    useEffect(() => {
        const initMap = async () => {


            const loader = new Loader({
                apiKey: process.env.GOOGLE_MAPS_API_KEY!,
                version: 'weekly'
            });

            const { Map } = await loader.importLibrary('maps');

            const position = {
                lat: -24.269798502643763,
                lng: -69.07215409231613
            }

            // map options

            const mapOptions: google.maps.MapOptions = {
                center: position,
                zoom: 17,
                mapId: 'mapid'
            }

            const map = new Map(mapRef.current! as HTMLDivElement, mapOptions);

        }

        initMap();
    }, [])

    return (
        <div>
            <div style={{ height: '300px', width: '100%' }} className="" ref={mapRef} />
        </div>

    )
}