import { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: { errors?: { name?: string[] } }; // State for handling errors if any
  label?: string;
  id?: string;
  name?: string;
  value: string; // Value prop to sync with parent state
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // onChange handler from parent
}

export const NameInput = ({
  state,
  label = 'Nombre:',
  id = 'usu_nombre',
  name = 'usu_nombre',
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
    let newValue = e.target.value;

    // Allow only alphabetic characters and spaces
    newValue = newValue.replace(/[^a-zA-Z\s]/g, '');

    setFormattedValue(newValue);

    // Modificar el valor en el evento y llamar a onChange
    if (onChange) {
      e.target.value = newValue; // Modificar el valor del evento
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
          <UserIcon className="h-5 w-5 text-gray-500" />
        </span>
        <input
          type="text"
          id={id}
          name={name}
          value={formattedValue}
          onChange={handleInputChange}
          className="w-full border px-2 py-1 pl-8 text-sm rounded"
          {...rest}
        />
      </div>
      {state?.errors?.name && (
        <p className="text-red-500 text-xs mt-1">
          {state.errors.name.join(', ')}
        </p>
      )}
    </div>
  );
};
