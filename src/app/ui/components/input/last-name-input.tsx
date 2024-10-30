import { useState, useEffect } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: { errors?: { lastName?: string[] } }; // State for handling errors if any
  label?: string;
  id?: string;
  name?: string;
}

export const LastNameInput = ({
  state,
  label = 'Ingrese Apellido:',
  id = 'lastName',
  name = 'usu_apellido',
  defaultValue = '', // Default value for the input
  ...rest
}: InputProps) => {
  const [formattedValue, setFormattedValue] = useState(defaultValue);

  // Sync with defaultValue when it changes
  useEffect(() => {
    setFormattedValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow only alphabetic characters and spaces
    value = value.replace(/[^a-zA-Z\s]/g, '');

    setFormattedValue(value);
  };

  return (
    <div className="mb-2">
      <label htmlFor={id} className="block mb-1 text-sm">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <UsersIcon className="h-5 w-5 text-gray-500" />
        </span>
        <input
          type="text"
          id={id}
          name={name}
          value={formattedValue} // Use the local formatted value
          onChange={handleInputChange}
          className="w-full border px-2 py-1 pl-8 text-sm rounded"
          {...rest}
        />
      </div>
      {state?.errors?.lastName && (
        <p className="text-red-500 text-xs mt-1">
          {state.errors.lastName.join(', ')}
        </p>
      )}
    </div>
  );
};
