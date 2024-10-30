import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  action: string; // action will be the API endpoint including the usu_id_rut
  onSuccess: () => void; // callback to trigger when the deletion is successful
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ action, onSuccess }) => {
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission

<<<<<<< HEAD
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
=======
    const confirmDelete = window.confirm('Estás seguro que quieres eliminar?');
>>>>>>> ab8a859c561150266ef579243a71d6784f584035

    if (confirmDelete) {
      try {
        const response = await fetch(action, {
          method: 'DELETE',
        });

        if (response.ok) {
<<<<<<< HEAD
          alert('User deleted successfully');
          onSuccess(); // Trigger the callback to refresh the users
        } else {
          alert('Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
=======
          alert('Eliminado');
          onSuccess(); // Trigger the callback to refresh the users
        } else {
          alert('Error deleting');
        }
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting');
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
      }
    }
  };

  return (
    <form onSubmit={handleDelete} action={action}>
      <button type="submit" className="rounded-md border p-1 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4 h-4" />
      </button>
    </form>
  );
};
