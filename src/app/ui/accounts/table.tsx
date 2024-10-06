'use client';

import { User } from '@/app/lib/definitions/user';

interface UsersTableProps {
  users: User[];
}

const Table: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">RUT</th>
          <th className="py-2 px-4 border-b">Nombre</th>
          <th className="py-2 px-4 border-b">Correo</th>
          <th className="py-2 px-4 border-b">Rol</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.rut_usuario}>
            <td className="py-2 px-4 border-b">{user.rut_usuario}</td>
            <td className="py-2 px-4 border-b">
              {user.nombres_usuario} {user.apellidos_usuario}
            </td>
            <td className="py-2 px-4 border-b">{user.correo_usuario}</td>
            <td className="py-2 px-4 border-b">{user.id_rol_usuario}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
