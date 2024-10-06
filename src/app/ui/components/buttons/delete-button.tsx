import { TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  action: string | ((formData: FormData) => void) | undefined;
}

export function DeleteButton({ action }: Props) {
  return (
    <form action={action}>
      <button className='rounded-md border p-1 hover:bg-gray-100'>
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-4 h-4' />
      </button>
    </form>
  );
}
