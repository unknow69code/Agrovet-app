'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <p>Información importante del sistema...</p>
    </div>
  );
}

export default Dashboard;