import { User } from '@/app/lib/definitions/user';
import Status from '@/app/ui/components/status'; // Import the Status component
import { DeleteButton } from '@/app/ui/components/buttons/delete-button'; // Import DeleteButton
import { UpdateButton } from '@/app/ui/components/buttons/update-button'; // Import UpdateButton

interface UsersTableProps {
  users: User[];
  onUserDeleted: () => void; // callback to refresh the table when a user is deleted
}

const Table: React.FC<UsersTableProps> = ({ users, onUserDeleted }) => {

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 w-full h-full">
      <table className="min-w-full bg-white border-collapse overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tl-lg">ID</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Cota</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left">Estado</th>
            <th className="py-2 px-4 bg-custom-blue text-white font-semibold text-xs uppercase text-left rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {users.map((user, index) => (
            <tr
              key={user.usu_id_rut}
              className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${
                index === users.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''
              }`}
            >
              <td className="py-2 px-4">D3000</td>
              <td className="py-2 px-4">10000</td>
              <td className="py-2 px-4">
                <Status status={user.usu_estado ?? false} />
              </td>
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  <UpdateButton href={`/accounts/edit/${user.usu_id_rut}`} />
                  <DeleteButton action={`/api/users/${user.usu_id_rut}`} onSuccess={onUserDeleted} /> {/* Pass the callback here */}
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
