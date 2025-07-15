"use client"
import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useRouter } from 'next/navigation';

export default function Layout({children}:{children: React.ReactNode}) {
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }else{
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
      </div>
    );
  }

  if (!token) {
        return null;
    }

  return (
    <main className='mx-auto w-full max-w-screen-2xl h-screen overflow-hidden flex flex-row'>
        <Sidebar />
        <div className='bg-[#f6f6f7] flex-1 px-4 md:px-6 lg:px-8 pt-6 h-full overflow-auto'>
            <Header />
            {children}
        </div>
    </main>
  )
}
