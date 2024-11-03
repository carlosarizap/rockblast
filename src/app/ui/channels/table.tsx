import { Channel } from '@/app/lib/definitions/channel';
import { DeleteButton } from '@/app/ui/components/buttons/delete-button';
import { UpdateButton } from '@/app/ui/components/buttons/update-button';
import NodeStatus from '../components/node-status';

interface ChannelTableProps {
  channels: Channel[];
  onChannelDeleted: () => void;
}

function mapToNodeStatus(status: string | undefined): 'Deshabilitado' | 'Operativo' | 'Problema' {
  switch (status) {
    case 'Deshabilitado':
    case 'Operativo':
    case 'Problema':
      return status;
    default:
      return 'Deshabilitado';
  }
}

const formatNumber = (value: any) => {
  // Try to convert to a number if it’s a string
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Check if the converted value is a valid number
  return typeof numericValue === 'number' && !isNaN(numericValue) ? numericValue.toFixed(2) : '-';
};


const ChannelTable: React.FC<ChannelTableProps> = ({ channels, onChannelDeleted }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 w-full h-full">
      <table className="min-w-full bg-white border-collapse overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Nombre</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Nodo</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Marca</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Num Serie</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Elevación</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Profundidad</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Cota</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Longitud Cable</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Rango Sensor</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Dip</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Estado</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {channels.map((channel, index) => (
            <tr
              key={channel.can_id}
              className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${index === channels.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''}`}
            >
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{channel.can_nombre}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{channel.nodo_nombre}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{channel.par_marca}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{channel.par_num_serie}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{formatNumber(channel.par_elevation_borehole)}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{formatNumber(channel.par_depth_transducer)}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{formatNumber(channel.par_cota_transducer)}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{channel.par_longitud_cable}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{channel.par_rango_del_sensor}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">{formatNumber(channel.par_dip)}</td>
              <td className="py-2 px-4 text-xs whitespace-nowrap overflow-hidden truncate">
                <NodeStatus status={mapToNodeStatus(channel.estado_nombre)} />
              </td>
              <td className="py-2 px-4 text-xs">
                <div className="flex space-x-2">
                  <UpdateButton href={`/channels/edit/${channel.can_id}`} />
                  <DeleteButton action={`/api/channels/${channel.can_id}`} onSuccess={onChannelDeleted} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ChannelTable;
