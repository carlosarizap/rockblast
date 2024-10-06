"use client"
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export function CreateButton({
  href,
  label = 'Crear',
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className='flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'>
      <span className='hidden md:block'>{label}</span>{' '}
      <PlusIcon className='h-5 md:ml-4' />
    </Link>
  );
}
