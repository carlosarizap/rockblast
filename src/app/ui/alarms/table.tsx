import { Alarm } from '@/app/lib/definitions/alarm';
import { DeleteButton } from '@/app/ui/components/buttons/delete-button'; // Import DeleteButton
import { UpdateButton } from '@/app/ui/components/buttons/update-button'; // Import UpdateButton
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faWater, faExclamationTriangle, faBolt, faDroplet, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'; // Import relevant icons for alert types
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import relevant icons for revision

interface AlarmsTableProps {
  alarms: Alarm[];
  onAlarmDeleted: () => void; // Callback to refresh the table when an alarm is deleted
}

// Map alert types to colors and icons
const getAlertTypeStyle = (alertType: string) => {
  switch (alertType) {
    case 'Cota de Agua':
      return {
        color: 'bg-blue-100 text-blue-800',
        icon: faDroplet,
      };
    case 'Tendencia Variación':
      return {
        color: 'bg-yellow-100 text-yellow-800',
        icon: faExclamationTriangle,
      };
    case 'Tendencia Cambio Abrupto':
      return {
        color: 'bg-red-100 text-red-800',
        icon: faCircleExclamation,
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800',
        icon: faExclamationTriangle,
      };
  }
};

const Table: React.FC<AlarmsTableProps> = ({ alarms, onAlarmDeleted }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 w-full h-full">
      <table className="min-w-full bg-white border-collapse overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tl-lg">Tipo</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Fecha Revisión</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">RUT Usuario</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Nombre Usuario</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Descripción</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-center">Revisión</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {alarms.map((alarm, index) => {
            const { color, icon } = getAlertTypeStyle(alarm.tipo_alerta || '');
            return (
              <tr
                key={alarm.ale_id}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${index === alarms.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''
                  }`}
              >
                <td className="py-2 px-4">
                  <div className={`inline-flex items-center gap-2 rounded-full px-2 py-1 ${color}`}>
                    <FontAwesomeIcon icon={icon} />
                    <span>{alarm.tipo_alerta}</span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  {alarm.ale_fecha
                    ? new Intl.DateTimeFormat("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }).format(new Date(alarm.ale_fecha))
                    : ""}
                </td>

                <td className="py-2 px-4">{alarm.usu_id_rut}</td>
                <td className="py-2 px-4">{alarm.usu_nombre} {alarm.usu_apellido}</td>
                <td className="py-2 px-4">{alarm.ale_description}</td>
                <td className="py-4 px-4 flex items-center justify-center">
                  {alarm.ale_revision ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-xl text-green-500"
                      title="Checked"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-xl text-red-500"
                      title="Not Checked"
                    />
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <UpdateButton href={`/alarms/edit/${alarm.ale_id}`} />
                    <DeleteButton action={`/api/alarms/${alarm.ale_id}`} onSuccess={onAlarmDeleted} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
