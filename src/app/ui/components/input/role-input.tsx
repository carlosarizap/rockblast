import { UserGroupIcon } from '@heroicons/react/24/outline'; // Importa el ícono de Heroicons

interface RoleSelectProps {
  roles: { rol_id: number; rol_nombre: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  state?: { errors?: { role?: string[] } };
}

export const RoleSelect = ({
  roles,
  value,
  onChange,
  state,
}: RoleSelectProps) => {
  return (
    <div className="mb-2">
      <label className="block mb-1 text-sm">Rol:</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <UserGroupIcon className="h-5 w-5 text-gray-500" />
        </span>
        <select
          name="rol_id"
          value={value}
          onChange={onChange}
          className="w-full border px-2 py-1 pl-8 text-sm rounded" // Ajustar el padding izquierdo (pl-8) para dejar espacio al ícono
          required
        >
          <option value="">Seleccionar rol</option>
          {roles.map((role) => (
            <option key={role.rol_id} value={role.rol_id}>
              {role.rol_nombre}
            </option>
          ))}
        </select>
      </div>
      {state?.errors?.role && (
        <p className="text-red-500 text-xs mt-1">
          {state.errors.role.join(', ')}
        </p>
      )}
    </div>
  );
};
