import { useState, useEffect } from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: { errors?: { dni?: string[] } }; // Make state optional
  label?: string;
  id?: string;
  name?: string;
}

export const DniInput = ({
  state,
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
          maxLength={maxLength} // Limit input to 10 characters
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
