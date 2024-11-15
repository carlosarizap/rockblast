'use client';
import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
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
  ChartOptions,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

interface LevelWaterData {
  dbr_fecha: string;
  cal_cota_pres_corr_poly: string;
  can_nombre: string;
}

const applyMovingAverage = (data: number[], windowSize: number) => {
  return data.map((_, index, array) => {
    const start = Math.max(0, index - windowSize + 1);
    const subset = array.slice(start, index + 1);
    const sum = subset.reduce((a, b) => a + b, 0);
    return sum / subset.length;
  });
};

export default function Layout() {
  const [channels, setChannels] = useState<any[]>([]);
  const [waterData, setWaterData] = useState<LevelWaterData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState<string>('N/A');
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as {
      label: string;
      data: number[];
      borderColor: string;
      borderWidth: number;
      fill: boolean;
      pointBackgroundColor: string;
      pointRadius: number;
      tension: number;
    }[],
  });
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [yAxisRange, setYAxisRange] = useState({ min: 2784, max: 2786 });

  // Fetch initial data and setup socket listeners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [initialWaterData, initialChannelData] = await Promise.all([
          fetch('http://localhost:5000/api/v1/canal/levelWater').then((res) => res.json()).then((data) => data.response),
          fetch('http://localhost:5000/api/v1/canal/status').then((res) => res.json()).then((data) => data.response),
        ]);
        setWaterData(initialWaterData);
        setChannels(initialChannelData);

        setupSocketListeners();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    const setupSocketListeners = () => {
      socket.on('levelWaterData', (data) => {
        setWaterData((prev) => {
          if (JSON.stringify(data.levelWater) !== JSON.stringify(prev)) {
            console.log('Recibiendo del socket level water');
            setWaterDataForChart(data.levelWater);
            return data.levelWater;
          }
          return prev;
        });
      });

      socket.on('statusCanalData', (data) => {
        setChannels((prev) => {
          if (JSON.stringify(data.statusCanal) !== JSON.stringify(prev)) {
            console.log('Recibiendo del socket status canal');
            return data.statusCanal;
          }
          return prev;
        });
      });

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      socket.io.engine.on('upgrade', (transport) => setTransport(transport.name));

      return () => {
        socket.off('levelWaterData');
        socket.off('statusCanalData');
        socket.off('connect');
        socket.off('disconnect');
        socket.io.engine.off('upgrade');
      };
    };

    fetchData();
  }, []);

  // Recalculate chart data when water data or selected channel changes
  useEffect(() => {
    setWaterDataForChart();
  }, [selectedChannel, waterData]);

  const setWaterDataForChart = (data = waterData) => {
    if (selectedChannel) {
      const filteredData = data
        .filter((item) => item.can_nombre === selectedChannel)
        .map((item) => ({
          date: new Date(item.dbr_fecha),
          polyValue: parseFloat(item.cal_cota_pres_corr_poly),
        }));

      updateChartData(filteredData);
    }
  };

  const updateChartData = (data: { date: Date; polyValue: number }[]) => {
    if (data.length === 0) {
      setChartData({
        labels: [],
        datasets: [
          {
            label: 'Cota Presión Corrección Polinómica',
            data: [],
            borderColor: '#00bcd4',
            borderWidth: 2,
            fill: false,
            pointBackgroundColor: '#00bcd4',
            pointRadius: 0,
            tension: 0.5,
          },
        ],
      });
      return;
    }

    const smoothedValues = applyMovingAverage(data.map((d) => d.polyValue), 3);
    const minLevel = Math.min(...smoothedValues);
    const maxLevel = Math.max(...smoothedValues);
    setYAxisRange({ min: minLevel - 2, max: maxLevel + 2 });

    setChartData({
      labels: data.map((d) => d.date.toLocaleDateString()),
      datasets: [
        {
          label: 'Cota Presión Corrección Polinómica',
          data: smoothedValues,
          borderColor: '#00bcd4',
          borderWidth: 5,
          fill: false,
          pointBackgroundColor: '#00bcd4',
          pointRadius: 0,
          tension: 0.5,
        },
      ],
    });
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { title: { display: true, text: 'Días' }, ticks: { maxTicksLimit: 5, autoSkip: true } },
      y: { min: yAxisRange.min, max: yAxisRange.max, title: { display: true, text: 'Niveles' } },
    },
  };

  return (
    <div className="flex h-screen">
      <div className="w-72 flex-none z-10 bg-white">
        <SideNav />
      </div>
      <div className="bg-white rounded-2xl flex-1 overflow-auto z-0 p-4">
        <div className="h-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-4 flex flex-col gap-4 rounded-2xl">
          <div className="flex gap-4 flex-grow">
            <div className="gap-4 flex-grow flex flex-col">
              <div className="rounded-2xl flex-[1.5] w-full shadow-md">
                <Map />
              </div>
              <div className="rounded-2xl flex-[1] bg-white p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-custom-blue">
                  {selectedChannel ? `${selectedChannel}` : ""}
                </h3>
                <div style={{ height: '200px', width: '100%' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 w-[21%] shadow-md">
              <h2 className="text-xl font-bold mb-4 text-custom-blue">Sensores</h2>
              <ul className="space-y-3">
                {channels.map((channel) => (
                  <li
                    key={channel.can_id}
                    className="flex items-center cursor-pointer"
                    onClick={() => setSelectedChannel(channel.can_nombre)}
                  >
                    <span className={`text-gray-700 text-xs ${selectedChannel === channel.can_nombre ? 'font-bold' : 'font-medium'}`}>
                      {channel.can_nombre} - Estado {channel.esc_nombre}
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