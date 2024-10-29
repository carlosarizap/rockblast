import { CheckIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface Props {
  status: 'Deshabilitado' | 'Operativo' | 'Problema';
}

export default function NodeStatus({ status }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
        {
          'bg-gray-300 text-gray-800': status === 'Deshabilitado',
          'bg-green-500 text-white': status === 'Operativo',
          'bg-yellow-500 text-white': status === 'Problema',
        }
      )}
    >
      {status === 'Deshabilitado' && (
        <>
          Deshabilitado
          <XMarkIcon className="ml-1 w-4 text-gray-800" />
        </>
      )}
      {status === 'Operativo' && (
        <>
          Operativo
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'Problema' && (
        <>
          Problema
          <ExclamationCircleIcon className="ml-1 w-4 text-white" />
        </>
      )}
    </span> 
  );
}
