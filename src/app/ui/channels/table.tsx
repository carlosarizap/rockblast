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
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return typeof numericValue === 'number' && !isNaN(numericValue) ? numericValue.toFixed(2) : '-';
};

const ChannelTable: React.FC<ChannelTableProps> = ({ channels, onChannelDeleted }) => {
  return (
    <div className="border border-gray-200 w-full h-full flex flex-col">
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '550px' }}>
        <table className="min-w-full bg-white border-collapse table-auto">
          <thead>
            <tr>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tl-lg whitespace-nowrap overflow-hidden">Nombre</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Nodo</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Marca</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Num Serie</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Elevación</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Profundidad</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Cota</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Longitud Cable</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Rango Sensor</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Dip</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-left whitespace-nowrap overflow-hidden">Estado</th>
              <th className="sticky top-0 py-2 px-2 bg-custom-blue text-white font-semibold text-xs uppercase text-center rounded-tr-lg whitespace-nowrap overflow-hidden">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {channels.map((channel, index) => (
              <tr
                key={channel.can_id}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
              >
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{channel.can_nombre}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{channel.nodo_nombre}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{channel.par_marca}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{channel.par_num_serie}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{formatNumber(channel.par_elevation_borehole)}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{formatNumber(channel.par_depth_transducer)}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{formatNumber(channel.par_cota_transducer)}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{channel.par_longitud_cable}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{channel.par_rango_del_sensor}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">{formatNumber(channel.par_dip)}</td>
                <td className="py-2 px-2 text-xs whitespace-nowrap overflow-hidden truncate text-left">
                  <NodeStatus status={mapToNodeStatus(channel.estado_nombre)} />
                </td>
                <td className="py-2 px-2 text-xs text-center">
                  <div className="flex justify-center space-x-2">
                    <UpdateButton href={`/channels/edit/${channel.can_id}`} />
                    <DeleteButton action={`/api/channels/${channel.can_id}`} onSuccess={onChannelDeleted} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default ChannelTable;
