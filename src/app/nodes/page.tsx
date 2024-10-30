'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidenav from '../ui/dashboard/sidenav';
import Table from '../ui/nodes/table';
<<<<<<< HEAD
import { User } from '@/app/lib/definitions/user';
=======
import { Node } from '@/app/lib/definitions/node';
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
import { CreateButton } from '../ui/components/buttons/create-button'; // Import your custom CreateButton

const NodesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
<<<<<<< HEAD
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
=======
  const [nodes, setNodes] = useState<Node[]>([]);

  const fetchNodes = async () => {
    const response = await fetch('/api/nodes');
    const data = await response.json();
    setNodes(data);
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'Admin') {
      router.push('/dashboard');
    }

<<<<<<< HEAD
    fetchUsers();
=======
    fetchNodes();
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
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
            <h1 className="text-white text-2xl font-bold">Gestión de Pozos</h1>
            <CreateButton href="/nodes/create" label="Crear Pozo" /> {/* Custom button */}
          </div>
          <div className="bg-white p-1 rounded-xl flex-1 overflow-auto">
<<<<<<< HEAD
            <Table users={users} onUserDeleted={fetchUsers} /> {/* Pass the fetchUsers function to Table */}
=======
            <Table nodes={nodes} onNodeDeleted={fetchNodes} /> {/* Pass the fetchNodes function to Table */}
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesPage;
