import { useState, useEffect } from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: { errors?: { dni?: string[] } }; // State contains the errors if any
  label?: string;
  id?: string;
  name?: string;
  value: string; // Add value prop
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
}

export const DniInput = ({
  state,
  label = 'RUT:',
  id = 'usu_id_rut',
  name = 'usu_id_rut',
  maxLength = 10,
  value,
  onChange,
  ...rest
}: InputProps) => {
  const [formattedValue, setFormattedValue] = useState(value);

  // Sync with value when it changes
  useEffect(() => {
    setFormattedValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^0-9kK]/g, '');

    if (newValue.includes('K') && newValue.indexOf('K') !== newValue.length - 1) {
      newValue = newValue.replace(/K/g, '');
    }

    if (newValue.length > 9) {
      newValue = newValue.slice(0, 9);
    }

    if (newValue.length > 1) {
      newValue = `${newValue.slice(0, -1)}-${newValue.slice(-1)}`;
    }

    newValue = newValue.toUpperCase();

    setFormattedValue(newValue);

    // Crear un evento modificado con el nuevo valor y llamarlo
    if (onChange) {
      e.target.value = newValue; // Modificar el valor en el evento
      onChange(e); // Pasar el evento modificado al padre
    }
  };

  return (
    <div className="mb-2">
      <label htmlFor={id} className="block mb-1 text-sm">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <IdentificationIcon className="h-5 w-5 text-gray-500" />
        </span>
        <input
          type="text"
          id={id}
          name={name}
          value={formattedValue}
          onChange={handleInputChange}
          maxLength={maxLength}
          className="w-full border px-2 py-1 pl-8 text-sm rounded"
          {...rest}
        />
      </div>
      {state?.errors?.dni && (
        <p className="text-red-500 text-xs mt-1">
          {state.errors.dni.join(', ')}
        </p>
      )}
    </div>
  );
};


