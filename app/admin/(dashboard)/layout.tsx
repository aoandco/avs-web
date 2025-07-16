"use client"
import React, { useEffect } from 'react'
import Header from '../_components/Header'
import Sidebar from '../_components/Sidebar'
import { useRouter } from 'next/navigation';

export default function Layout({children}: {children: React.ReactNode}) {
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();


  useEffect(()=>{
    const storedToken = sessionStorage.getItem("token")
    if(!storedToken){
      router.push('/login');
    }else{
      setToken(storedToken);
    }
    setIsLoading(false);
  }, [router])

  if(isLoading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
      </div>
    );
  }

  if(!token){
    return null;
  }

  return (
    <main className='px-[5%] 2xl:px-0 mx-auto max-w-screen-2xl h-screen overflow-hidden flex flex-col'>
        <Header />
        <section className='flex-1 flex flex-col lg:flex-row gap-6 mb-4 h-full'>
            <Sidebar />
            {children}
        </section>
    </main>
  )
}
