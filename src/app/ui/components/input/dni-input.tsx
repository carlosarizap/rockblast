import { useState, useEffect } from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
<<<<<<< HEAD
  state?: { errors?: { dni?: string[] } }; // Make state optional
  label?: string;
  id?: string;
  name?: string;
=======
  state?: { errors?: { dni?: string[] } }; // State contains the errors if any
  label?: string;
  id?: string;
  name?: string;
  value: string; // Add value prop
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
}

export const DniInput = ({
  state,
<<<<<<< HEAD
  label = 'Ingrese RUT',
  id = 'dni',
  name = 'dni',
  maxLength = 10, // Limit characters to 10 (XXXXXXXX-X)
  defaultValue = '', // Default value for the input
  ...rest
}: InputProps) => {
  const [formattedValue, setFormattedValue] = useState(defaultValue);

  useEffect(() => {
    setFormattedValue(defaultValue); // Sync with defaultValue when it changes
  }, [defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove all non-numeric characters except for 'K'
    value = value.replace(/[^0-9K]/gi, '');

    // Convert lowercase 'k' to uppercase 'K'
    value = value.toUpperCase();

    // Automatically insert the dash after the second digit
    if (value.length > 2 && value[2] !== '-') {
      value = value.slice(0, 2) + '-' + value.slice(2);
    }

    // Limit input to 10 characters (XXXXXXXX-X)
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setFormattedValue(value);
=======
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
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
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
<<<<<<< HEAD
          maxLength={maxLength} // Limit input to 10 characters
=======
          maxLength={maxLength}
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
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
<<<<<<< HEAD
=======


>>>>>>> ab8a859c561150266ef579243a71d6784f584035
