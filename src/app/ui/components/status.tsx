import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface Props {
  status: boolean;
  activeLabel?: string;
  deactiveLabel?: string;
}

export default function Status({
  status,
  activeLabel = 'Activo',
  deactiveLabel = 'Inactivo',
}: Props) {
  return (

    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
        {
          'bg-gray-200 text-gray-500': !status,
          'bg-green-500 text-white': status,
        }
      )}>
      {!status ? (
        <>
          {deactiveLabel}
          <XMarkIcon className='ml-1 w-4 text-gray-500' />
        </>
      ) : (
        <>
          {activeLabel}
          <CheckIcon className='ml-1 w-4 text-white' />
        </>
      )}
    </span>
  );
}
