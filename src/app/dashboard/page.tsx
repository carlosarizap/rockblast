'use client'
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { socket } from '../socket';
import SideNav from '@/app/ui/dashboard/sidenav';
import { Map } from '../ui/map';
import { Line } from 'react-chartjs-2';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import moment from 'moment';
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
    case 'critico':
      return (
        <FontAwesomeIcon
          icon={faCircleArrowUp}
          className="text-red-500"
          size="lg"
          title="Critico"
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
  const [nodeStatusData, setNodeStatusData] = useState<any[]>([]);
  const [transport, setTransport] = useState<string>('N/A');
  const [rangeValues, setRangeValues] = useState<number[]>([0, 1]); // Set default range
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const [initialNodeData, setInitialNodeData] = useState<any[]>([]);
  const [clickedNode, setClickedNode] = useState<string | null>(null); // For channel clicks

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
    if (selectedChannel && startDate && endDate) {
      setWaterDataForChart();
    }
  }, [selectedChannel, startDate, endDate, waterData]);

  useEffect(() => {
    if (selectedChannel && startDate && endDate) {
      setWaterDataForChart();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedChannel && waterData.length > 0) {
      // Perform data filtering and date calculations as before
      const filteredData = waterData.filter((item) => item.can_nombre === selectedChannel);

      if (filteredData.length > 0) {
        // Calculate and set min, max, start, and end dates as before
        const minDateValue = new Date(filteredData[0].dbr_fecha);
        const maxDateValue = new Date(filteredData[filteredData.length - 1].dbr_fecha);

        setMinDate(minDateValue);
        setMaxDate(maxDateValue);

        const maxDateTimestamp = maxDateValue.getTime();
        const oneWeekAgoTimestamp = maxDateTimestamp - 7 * 24 * 60 * 60 * 1000;

        let startIndex = filteredData.findIndex((item) => new Date(item.dbr_fecha).getTime() >= oneWeekAgoTimestamp);
        if (startIndex === -1) {
          startIndex = 0;
        }

        // Set start and end dates
        setStartDate(new Date(filteredData[startIndex].dbr_fecha));
        setEndDate(new Date(filteredData[filteredData.length - 1].dbr_fecha));

        // Set the correct slider range values
        setRangeValues([startIndex, filteredData.length - 1]);

        // Call `setWaterDataForChart` with the updated data
        setWaterDataForChart(filteredData);
      }
    }
  }, [selectedChannel, waterData]);

  // Fetch initial data and setup socket listeners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [initialWaterData, initialChannelData, initialNodeData] = await Promise.all([
          fetch('http://localhost:5000/api/v1/canal/levelWater')
            .then((res) => res.json())
            .then((data) => data.response),
          fetch('http://localhost:5000/api/v1/canal/status')
            .then((res) => res.json())
            .then((data) => data.response),
          fetch('http://localhost:5000/api/v1/nodo')
            .then((res) => res.json())
            .then((data) => data.response),
        ]);

        setInitialNodeData(initialNodeData);
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

      socket.on('statusNodoData', (data) => {
        console.log('Nodo status data received:', data);
        setNodeStatusData(data.statusNodo); // Update node status data
      });

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      socket.io.engine.on('upgrade', (transport) =>
        setTransport(transport.name)
      );

      return () => {
        socket.off('levelWaterData');
        socket.off('statusCanalData');
        socket.off('statusNodoData');
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


  useEffect(() => {
    setWaterDataForChart();
  }, [waterData, selectedChannel]);

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setRangeValues(value);
      setWaterDataForChart();
    }
  };



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
      const filteredData = data.filter((item) => item.can_nombre === selectedChannel);

      if (filteredData.length > 0) {
        const slicedData = filteredData.slice(rangeValues[0], rangeValues[1] + 1);

        const chartLabels = slicedData.map((item) => new Date(item.dbr_fecha).toLocaleDateString());
        const chartValues = slicedData.map((item) => parseFloat(item.cal_cota_pres_corr_poly));

        const smoothedValues = applyMovingAverage(chartValues, 3);
        const minLevel = Math.min(...smoothedValues);
        const maxLevel = Math.max(...smoothedValues);

        // Find the cota_critica for the selected node
        const node = initialNodeData.find((n) => n.nod_nombre === clickedNode);
        const cotaCritica = node ? node.cota_critica : null;

        // Adjust the yAxis range dynamically
        const padding = 1; // Add some padding to ensure better visibility
        let newYAxisMin = minLevel - padding;
        let newYAxisMax = maxLevel + padding;

        // Ensure cota_critica is visible if it exists
        if (cotaCritica !== null) {
          newYAxisMin = Math.min(newYAxisMin, cotaCritica - padding);
          newYAxisMax = Math.max(newYAxisMax, cotaCritica + padding);
        }

        // Limit the range expansion to prevent overly large vertical scales
        const maxRange = maxLevel - minLevel + 50; // Adjust this value for your dataset
        if (newYAxisMax - newYAxisMin > maxRange) {
          newYAxisMin = minLevel - padding;
          newYAxisMax = maxLevel + padding;
        }
        const predictedLabels = predictionData.map((item) => new Date(item.Fecha).toLocaleDateString());
        const predictedValues = predictionData.map((item) => item.Prediccion);

        setYAxisRange({ min: newYAxisMin, max: newYAxisMax });

        setChartData({
          labels: [...chartLabels, ...predictedLabels],
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
            ...(cotaCritica !== null
              ? [
                {
                  label: 'Cota Crítica',
                  data: new Array(smoothedValues.length).fill(cotaCritica),
                  borderColor: 'red',
                  borderWidth: 2,
                  fill: false,
                  pointBackgroundColor: 'red',
                  pointRadius: 0,
                  tension: 0,
                },
              ]
              : []),
            ...(predictionData.length > 0
              ? [
                {
                  label: 'Predicción',
                  data: new Array(chartValues.length).fill(null).concat(predictedValues),
                  borderColor: '#e1ad01',
                  borderWidth: 2,
                  fill: false,
                  pointBackgroundColor: '#e1ad01',
                  pointRadius: 0,
                  tension: 0.5,
                },
              ]
              : []),
          ],
        });

      } else {
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Cota Presión Corrección Polinómica',
              data: [],
              borderColor: '#00bcd4',
              borderWidth: 5,
              fill: false,
              pointBackgroundColor: '#00bcd4',
              pointRadius: 0,
              tension: 0.5,
            },
          ],
        });
      }
    }
  };


  const [predictionData, setPredictionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPredictionData = async () => {
      if (selectedChannel && selectedNodeName) {
        const payload = {
          canal: selectedChannel,
          nodo: selectedNodeName,
        };

        try {
          const response = await fetch('http://localhost:5000/api/v1/canal/prediccion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Error in fetch: ${response.statusText}`);
          }

          const data = await response.json();
          setPredictionData(data);

          console.log(data)
        } catch (error) {
          console.error('Error fetching prediction data:', error);
        }
      }
    };

    fetchPredictionData();
  }, [selectedChannel, selectedNodeName]);





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
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14,
          weight: 600, // Corrected to a number
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 12,
          weight: 400, // Corrected to a number
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Días',
          font: {
            family: "'Poppins', sans-serif",
            size: 16,
            weight: 500, // Corrected to a number
          },
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          maxTicksLimit: 5,
          autoSkip: true,
        },
      },
      y: {
        min: yAxisRange.min, // Dynamically adjust the min
        max: yAxisRange.max, // Dynamically adjust the max
        title: {
          display: true,
          text: 'Nivel',
          font: {
            family: "'Poppins', sans-serif",
            size: 16,
            weight: 500, // Corrected to a number
          },
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
        },
      },
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
                <Map nodes={initialNodeData} />
              </div>
              <div className="rounded-2xl flex-[1] bg-white p-4 shadow-md relative">
                <div className=''>
                  <div className="absolute top-3 right-4 bg-gray-100 rounded-xl py-2 px-4" style={{ width: '55%' }}>
                    {/* Container for the date indicators */}
                    <div className="flex justify-between mb-1 text-xs text-gray-600">
                      {(() => {
                        // Filter the data for the selected channel
                        const filteredData = waterData.filter(item => item.can_nombre === selectedChannel);
                        // Ensure rangeValues are within bounds and filteredData is not empty
                        const startDate = filteredData[rangeValues[0]]
                          ? moment(filteredData[rangeValues[0]].dbr_fecha).format('YYYY-MM-DD')
                          : 'N/A';
                        const endDate = filteredData[rangeValues[1]]
                          ? moment(filteredData[rangeValues[1]].dbr_fecha).format('YYYY-MM-DD')
                          : 'N/A';

                        return (
                          <>
                            <span>{startDate}</span>
                            <span>{endDate}</span>
                          </>
                        );
                      })()}
                    </div>
                    {/* The slider component */}
                    <Slider
                      range
                      min={0}
                      max={waterData.filter((item) => item.can_nombre === selectedChannel).length - 1}
                      value={rangeValues}
                      onChange={handleSliderChange}
                      trackStyle={[{ backgroundColor: '#00bcd4' }]} // Changed to a blue color for better contrast
                      handleStyle={[
                        { borderColor: '#00bcd4', backgroundColor: '#00bcd4' }, // Handle color adjusted to be consistent and visible
                        { borderColor: '#00bcd4', backgroundColor: '#00bcd4' },
                      ]}
                      railStyle={{ backgroundColor: '#b0bec5' }}
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-custom-blue">
                    {selectedChannel && selectedNodeName
                      ? `Nodo: ${selectedNodeName} - Canal: ${selectedChannel}`
                      : 'Seleccione un canal'}
                  </h3>
                </div>

                <div className='mt-5' style={{ height: '200px', width: '100%' }}>
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
                        setClickedNode(channel.nod_nombre);
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
