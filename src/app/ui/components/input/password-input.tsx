import { useState, useEffect } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: { errors?: { password?: string[] } };
  label?: string;
  id?: string;
  name?: string;
}

export const PasswordInput = ({
  state,
  label = 'Contraseña:',
  id = 'password',
  name = 'usu_pass',
  defaultValue = '', // Default value for the input
  ...rest
}: InputProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="mb-2">
      <label htmlFor={id} className="block mb-1 text-sm">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <LockClosedIcon className="h-5 w-5 text-gray-500" />
        </span>
        <input
          type="password"
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full border px-2 py-1 pl-8 text-sm rounded"
          {...rest}
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500 text-xs mt-1">
          {state.errors.password.join(', ')}
        </p>
      )}
    </div>
  );
};
