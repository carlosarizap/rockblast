'use client';
import React, { useEffect, useState } from 'react';

import SideNav from '@/app/ui/dashboard/sidenav';
import { Map } from '../ui/map';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Channel } from '../lib/definitions/channel';

// Register the necessary components for Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

export default function Layout() {
  // Data for the chart

  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/api/channels');
        const data = await response.json();
        setChannels(data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
    fetchChannels();
  }, []);

  const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Piezómetro D2300 - nivel ALTO - Canal B',
        data: [70, 70, 70, 70, 70, 70, 70],
        borderColor: 'red',
        borderWidth: 5,
        fill: false,
        pointBackgroundColor: 'red',
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'Canal B hasta Mayo',
        data: [30, 35, 33, 40, 50, null, null],
        borderColor: '#00D6E3', // Azul personalizado
        borderWidth: 5,
        fill: false,
        pointBackgroundColor: '#00D6E3',
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'Canal B desde Junio',
        data: [null, null, null, null, 50, 60, 100],
        borderColor: '#FFD700', // Amarillo
        borderWidth: 5,
        fill: false,
        pointBackgroundColor: '#FFD700',
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        grid: {
          display: true,
        },
        title: {
          display: true,
          text: 'Niveles',
        },
      },
    },
  };

  return (
    <div className="flex h-screen">
      {/* Sidenav on the left */}
      <div className="w-72 flex-none z-10 bg-white">
        <SideNav />
      </div>

      {/* Main content */}
      <div className="bg-white rounded-2xl flex-1 overflow-auto z-0 p-4">
        <div className="h-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-4 flex flex-col gap-4 rounded-2xl">
          <div className="flex gap-4 flex-grow">
            <div className="gap-4 flex-grow flex flex-col">
              {/* Map div with slightly more height */}
              <div className="rounded-2xl flex-[1.5] w-full shadow-md">
                <Map />
              </div>
              {/* Graph div */}
              <div className="rounded-2xl flex-[1] bg-white p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-custom-blue">
                  Piezómetro D2300 - Nivel ALTO - Canal B
                </h3>
                <div style={{ height: '200px', width: '100%' }}>
                  <Line data={data} options={options} />
                </div>
              </div>
            </div>

            {/* Placeholder content for sensors */}
            <div className="bg-white rounded-2xl p-4 w-1/5 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-custom-blue">Sensores</h2>
              <ul className="space-y-3">
                {channels.map((channel) => (
                  <li key={channel.can_id} className="flex items-center">
                    <span className="text-gray-700 text-xs font-medium">
                      {channel.can_nombre} - Nodo {channel.nodo_nombre}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
