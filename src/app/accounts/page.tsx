'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidenav from '../ui/dashboard/sidenav';
import Table from '../ui/accounts/table';
import { User } from '@/app/lib/definitions/user';
import { CreateButton } from '../ui/components/buttons/create-button'; // Import your custom CreateButton

const AccountsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'Admin') {
      router.push('/dashboard');
    }

    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidenav on the left */}
      <div className="w-72 flex-none z-10 bg-white">
        <Sidenav />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto p-4">
        <div className="h-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-6 rounded-2xl flex flex-col">
          {/* Flex container for the title and button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white text-2xl font-bold">Gestión de Cuentas</h1>
            <CreateButton href="/accounts/create" label="Crear Usuario" /> {/* Custom button */}
          </div>
          <div className="bg-white p-1 rounded-xl flex-1 overflow-auto">
            <Table users={users} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
