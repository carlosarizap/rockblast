'use client';

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

// Register the necessary components for Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

export default function Layout() {
  // Data for the chart
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
            <div className="bg-white rounded-2xl p-4 w-2/7 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-custom-blue">Sensores</h2>
              <ul className="space-y-3">
                {[
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
                ]
                  .sort((a, b) => {
                    const levelOrder: Record<string, number> = { ALTO: 1, MEDIO: 2, BAJO: 3 };
                    return levelOrder[a.level] - levelOrder[b.level];
                  })
                  .map((sensor) => (
                    <li key={sensor.id} className="flex items-center">
                      <span
                        className={`inline-block w-4 h-4 rounded-full mr-3`}
                        style={{ backgroundColor: sensor.color }}
                      ></span>
                      <span className="text-gray-700 font-medium">
                        Piezómetro {sensor.id} - nivel {sensor.level}
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
