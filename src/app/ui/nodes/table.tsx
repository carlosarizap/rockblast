import { Node } from '@/app/lib/definitions/node';
import { DeleteButton } from '@/app/ui/components/buttons/delete-button'; // Import DeleteButton
import { UpdateButton } from '@/app/ui/components/buttons/update-button'; // Import UpdateButton
import NodeStatus from '../components/node-status';

interface NodesTableProps {
  nodes: Node[];
  onNodeDeleted: () => void; // callback to refresh the table when a node is deleted
}

function mapToNodeStatus(status: string): 'Deshabilitado' | 'Operativo' | 'Problema' {
  switch (status) {
    case 'Deshabilitado':
    case 'Operativo':
    case 'Problema':
      return status;
    default:
      return 'Deshabilitado'; // Valor por defecto si el estado no coincide con los valores esperados
  }
}


const Table: React.FC<NodesTableProps> = ({ nodes, onNodeDeleted }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 w-full h-full">
      <table className="min-w-full bg-white border-collapse overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tl-lg">ID</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Cota</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Coordenada X</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Coordenada Y</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Estado</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {nodes.map((node, index) => (
            <tr
              key={node.nod_id}
              className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${index === nodes.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''
                }`}
            >
              <td className="py-2 px-4">{node.nod_nombre}</td>
              <td className="py-2 px-4">{node.nod_cota}</td>
              <td className="py-2 px-4">{node.nod_coord_este}</td>
              <td className="py-2 px-4">{node.nod_coord_norte}</td>
              <td className="py-2 px-4">
                <NodeStatus status={mapToNodeStatus(node.estado_nombre)} />
              </td>
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  <UpdateButton href={`/nodes/edit/${node.nod_id}`} />
                  <DeleteButton action={`/api/nodes/${node.nod_id}`} onSuccess={onNodeDeleted} /> {/* Pass the callback here */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
