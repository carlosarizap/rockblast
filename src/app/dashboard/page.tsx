'use client'
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowDown,
  faCircleArrowUp,
  faTriangleExclamation,
  faBan,
  faCircleCheck,
  faTools,
  faCheck,
  faThermometer,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'bajo':
      return (
        <FontAwesomeIcon
          icon={faCircleArrowDown}
          className="text-blue-500"
          size="lg"
          title="Bajo"
        />
      );
    case 'medio':
      return (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500"
          size="lg"
          title="Medio"
        />
      );
    case 'alto':
      return (
        <FontAwesomeIcon
          icon={faCircleArrowUp}
          className="text-red-500"
          size="lg"
          title="Alto"
        />
      );
    case 'problema':
      return (
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-yellow-500"
          size="lg"
          title="Problema"
        />
      );
    case 'deshabilitado':
      return (
        <FontAwesomeIcon
          icon={faBan}
          className="text-gray-500"
          size="lg"
          title="Deshabilitado"
        />
      );
    case 'operativo':
      return (
        <FontAwesomeIcon
          icon={faCheck}
          className="text-teal-500"
          size="lg"
          title="Operativo"
        />
      );
    default:
      return null;
  }
};


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
  const [filteredChannels, setFilteredChannels] = useState<any[]>([]);
  const [waterData, setWaterData] = useState<LevelWaterData[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedNodeName, setSelectedNodeName] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date()); 
  const [endDate, setEndDate] = useState<Date>(new Date());

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
  const [yAxisRange, setYAxisRange] = useState({ min: 2784, max: 2786 });

  useEffect(() => {
    setWaterDataForChart();
  }, [selectedChannel, waterData]);

  useEffect(() => {
    // Obtener la fecha más reciente de los datos al cargar
    if (waterData.length > 0) {
      const latestDate = new Date(
        Math.max(...waterData.map((item) => new Date(item.dbr_fecha).getTime()))
      );
      setEndDate(latestDate); // Fecha final
      setStartDate(new Date(latestDate.setDate(latestDate.getDate() - 7))); // Últimos 7 días desde la fecha más reciente
    }
  }, [waterData]);
  

  // Fetch initial data and setup socket listeners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [initialWaterData, initialChannelData] = await Promise.all([
          fetch('http://localhost:5000/api/v1/canal/levelWater')
            .then((res) => res.json())
            .then((data) => data.response),
          fetch('http://localhost:5000/api/v1/canal/status')
            .then((res) => res.json())
            .then((data) => data.response),
        ]);
        setWaterData(initialWaterData);
        setChannels(initialChannelData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    const setupSocketListeners = () => {
      socket.on('levelWaterData', (data) => {
        console.log('Socket data received:', data);
        setWaterData((prev) => {
          if (JSON.stringify(data.levelWater) !== JSON.stringify(prev)) {
            setWaterDataForChart(data.levelWater);
            return data.levelWater;
          }
          return prev;
        });
      });

      socket.on('statusCanalData', (data) => {
        setChannels(data.statusCanal);
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
    setupSocketListeners();
  }, []);

  useEffect(() => {
    setWaterDataForChart();
  }, [waterData, selectedChannel]);



  // Filter channels when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setFilteredChannels(channels.filter((channel) => channel.nod_nombre === selectedNode));
    } else {
      setFilteredChannels(channels);
    }
  }, [selectedNode, channels]);

  const setWaterDataForChart = (data = waterData) => {
    if (selectedChannel) {
      // Filtrar datos por canal y rango de fechas
      const filteredData = data
        .filter(
          (item) =>
            item.can_nombre === selectedChannel &&
            new Date(item.dbr_fecha) >= startDate &&
            new Date(item.dbr_fecha) <= endDate
        )
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
    <div className="flex h-screen relative">


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
                  {selectedChannel && selectedNodeName
                    ? `Nodo: ${selectedNodeName} - Canal: ${selectedChannel}`
                    : 'Seleccione un canal'}
                </h3>
                <div style={{ height: '200px', width: '100%' }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date || startDate)}
                    maxDate={endDate} // Ensures start date doesn't go beyond the end date
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date || endDate)}
                    minDate={startDate} // Ensures end date doesn't go before the start date
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />

                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-2 w-[21%] shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl mt-1 font-bold text-custom-blue">Canales</h2>
                <select
                  className="border border-gray-300 rounded-md text-sm px-2 py-1"
                  value={selectedNode || ''}
                  onChange={(e) => setSelectedNode(e.target.value || null)}
                >
                  <option value="">Todos</option>
                  {Array.from(new Set(channels.map((channel) => channel.nod_nombre))).map((node) => (
                    <option key={node} value={node}>
                      Nodo {node}
                    </option>
                  ))}
                </select>
              </div>

              <div className="max-h-[570px] overflow-y-auto pr-2 custom-scrollbar">
                <ul className="space-y-2">
                  {filteredChannels.map((channel) => (
                    <li
                      key={channel.can_id}
                      className={`flex items-start gap-2 cursor-pointer p-4 rounded-lg shadow-sm hover:bg-gray-200 transition-all ${selectedChannel === channel.can_nombre ? 'bg-gray-300' : 'bg-gray-100'
                        }`}
                      onClick={() => {
                        setSelectedChannel(channel.can_nombre);
                        setSelectedNodeName(channel.nod_nombre);
                      }}
                    >
                      {/* Custom Blue Circle Icon */}
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-custom-blue self-center text-xs mt-1"
                        size="lg"
                        title="Node"
                      />

                      {/* Node and Channel Info */}
                      <div className="flex-grow">
                        {/* Top: Title */}
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-gray-800 text-sm ${selectedChannel === channel.can_nombre ? 'font-bold' : 'font-medium'
                              }`}
                          >
                            {channel.nod_nombre} {channel.can_nombre}
                          </span>
                        </div>

                        {/* Bottom Content */}
                        <div className="flex justify-between items-end mt-2">
                          {/* Bottom-Left: esc_nombre */}
                          <div className="flex items-center gap-1">
                            {getStatusIcon(channel.esc_nombre)}
                            <span className="text-gray-600 text-xs">{channel.esc_nombre}</span>
                          </div>

                          {/* Bottom-Right: nia_nombre */}
                          <div className="flex items-center gap-1">
                            {getStatusIcon(channel.nia_nombre)}
                            <span className="text-gray-600 text-xs">{channel.nia_nombre}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}
