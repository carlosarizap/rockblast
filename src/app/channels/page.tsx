'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidenav from '../ui/dashboard/sidenav';
import Table from '../ui/channels/table';
import { Channel } from '@/app/lib/definitions/channel';
import { CreateButton } from '../ui/components/buttons/create-button';

export default function Layout() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [channels, setChannels] = useState<Channel[]>([]);
  
    const fetchChannels = async () => {
      const response = await fetch('/api/channels');
      const data = await response.json();
      setChannels(data);
    };
  
    useEffect(() => {
      if (status === 'authenticated' && session?.user?.role !== 'Admin') {
        router.push('/dashboard');
      }
  
      fetchChannels();
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
                <h1 className="text-white text-2xl font-bold">Gestión de Canales</h1>
                <CreateButton href="/nodes/create" label="Crear Canal" /> {/* Custom button */}
              </div>
              <div className="bg-white p-1 rounded-xl flex-1 overflow-auto">
                <Table channels={channels} onChannelDeleted={fetchChannels} /> {/* Pass the fetchChannels function to Table */}
              </div>
            </div>
          </div>
        </div>
      );
}
