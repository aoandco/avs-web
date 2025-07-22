"use client"
import React, { useEffect } from 'react'
import Header from '../_components/Header'
import Sidebar from '../_components/Sidebar'
import { useRouter } from 'next/navigation';
import { useMyContext } from '@/app/context/MyContext';
import TaskModal from '../_components/TaskModal';
import ComplaintsModal from '../_components/ComplaintsModal';
import DeleteTaskModal from '../_components/DeleteTaskModal';
import ViewReportModal from '../_components/ViewReportModal';
import RejectTaskModal from '../_components/RejectTaskModal';

export default function Layout({children}: {children: React.ReactNode}) {
  const {isTaskModalOpen, isComplaintsModalOpen, isDeleteTaskModalOpen, isViewReportModalOpen, isRejectTaskModalOpen} = useMyContext();
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
    <main className='px-[5%] 2xl:px-0 pb-4 mx-auto max-w-screen-2xl h-screen overflow-auto flex flex-col'>
        <Header />
        <section className='flex flex-col lg:flex-row gap-6 flex-1'>
            <Sidebar />
            {children}
        </section>
        {
          isTaskModalOpen && 
          <TaskModal />
        }
        {
          isComplaintsModalOpen && 
            <ComplaintsModal />
        }
        {
          isDeleteTaskModalOpen
          &&
          <DeleteTaskModal />
        }
        {
           isViewReportModalOpen &&
          <ViewReportModal
          />
        }
        {isRejectTaskModalOpen && (
            <RejectTaskModal
            />
        )}
    </main>
  )
}
