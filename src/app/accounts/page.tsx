'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { useEffect, useState } from 'react';
import Sidenav from '../ui/dashboard/sidenav';
import Table from '../ui/accounts/table';
import { User } from '@/app/lib/definitions/user';

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
    <div className='flex h-screen'>
      <div className='w-72 flex-none z-10 bg-white'>
        <Sidenav />
      </div>
      <div className='bg-white rounded-2xl flex-1 overflow-auto z-0 p-4'>
        <h5 className="mb-4">Cuentas</h5>
        <Table users={users} />
      </div>
    </div>
  );
}

export default AccountsPage;
