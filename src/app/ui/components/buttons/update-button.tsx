import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';

export function UpdateButton({ href }: { href: string }) {
  return (
    <Link href={href} className="rounded-md border p-1 hover:bg-gray-100"
    title="Editar"
    >
      <PencilIcon className="w-4 h-4" />
    </Link>
  );
}
