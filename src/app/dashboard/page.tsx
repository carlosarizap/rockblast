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
import { Channel } from '../lib/definitions/channel';

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
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as { label: string; data: number[]; borderColor: string; borderWidth: number; fill: boolean; pointBackgroundColor: string; pointRadius: number; tension: number; }[],
  });
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [waterData, setWaterData] = useState<LevelWaterData[]>([]);
  const [yAxisRange, setYAxisRange] = useState({ min: 2784, max: 2786 }); // Default y-axis range

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");
    };

    const handleTransportUpgrade = (transport: { name: string }) => {
      setTransport(transport.name);
    };

    const handleWaterData = (data: { levelWater: LevelWaterData[] }) => {
      setWaterData(data.levelWater);
    };

    const handleStatusCanalData = (data: { statusCanal: Channel[] }) => {
      setChannels(data.statusCanal);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("levelWaterData", handleWaterData);
    socket.on("statusCanalData", handleStatusCanalData);
    socket.io.engine.on("upgrade", handleTransportUpgrade);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("levelWaterData", handleWaterData);
      socket.off("statusCanalData", handleStatusCanalData);
      socket.io.engine.off("upgrade", handleTransportUpgrade);
    };
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      const formattedData = waterData
        .map((item) => ({
          date: new Date(item.dbr_fecha),
          polyValue: parseFloat(item.cal_cota_pres_corr_poly),
          channelName: item.can_nombre,
        }))
        .filter((item) => item.channelName === selectedChannel);

      updateChartData(formattedData);
    }
  }, [selectedChannel, waterData]);

  const updateChartData = (data: { date: Date; polyValue: number; channelName: string }[]) => {
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

    const latestDate = data.reduce((max, item) => (item.date > max ? item.date : max), data[0].date);
    const sevenDaysBeforeLatest = new Date(latestDate);
    sevenDaysBeforeLatest.setDate(latestDate.getDate() - 7);

    const filteredData = data.filter((item) => item.date >= sevenDaysBeforeLatest);
    const values = filteredData.map((data) => data.polyValue);
    const smoothedValues = applyMovingAverage(values, 3);

    // Calculate dynamic y-axis range based on smoothedValues
    const minLevel = Math.min(...smoothedValues);
    const maxLevel = Math.max(...smoothedValues);
    setYAxisRange({ min: minLevel - 2, max: maxLevel + 2 }); // Add padding for better visibility

    setChartData({
      labels: filteredData.map((data) => data.date.toLocaleDateString()),
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

  const handleChannelSelect = (channelName: string) => {
    setSelectedChannel(channelName);
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          text: 'Días',
        },
        ticks: {
          maxTicksLimit: 5, // Limits the number of ticks shown on the x-axis
          autoSkip: true, // Automatically skips labels if there are too many
        },
      },
      y: {
        min: yAxisRange.min,
        max: yAxisRange.max,
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
                    className={`flex items-center cursor-pointer`}
                    onClick={() => handleChannelSelect(channel.can_nombre)}
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
      <div>
      </div>
    </div>
  );
}
