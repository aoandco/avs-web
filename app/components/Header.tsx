"use client"
import React from 'react'
import { LogOut, Menu, User } from 'lucide-react';
import { useMyContext } from '../context/MyContext';
import { useRouter } from 'next/navigation';


export default function Header() {
    const {toggleSidebar} = useMyContext()
    const router = useRouter();
    const userobj = JSON.parse(sessionStorage.getItem('user') || '{}');

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        router.push('/login');
    }

  return (
    <div className='mb-4 md:mb-6 lg:mb-8 flex flex-row  justify-between items-center'>
        <div className='flex flex-row gap-4 md:gap-6 lg:gap-0 items-center'>
            <Menu onClick={toggleSidebar} className='block lg:hidden cursor-pointer text-xl' />
            <div className='flex flex-col gap-1 cursor-pointer'>
                <p className='text-sm sm:text-xl font-semibold'>Hello,</p>
                <p className='text-sm sm:text-xl'>{userobj.email}</p>
            </div> 
        </div>
        <div className='flex flex-row gap-4 items-center'>
            <div className='w-[32px] sm:w-[40px] h-[32px] sm:h-[40px] rounded-full bg-[#d9d9d9] flex justify-center items-center'>
                <User className='text-base sm:text-xl text-black' />
            </div>
            <div onClick={handleLogout} className='cursor-pointer text-sm sm:text-base font-semibold flex flex-row gap-2 items-center justify-center hover:text-red-500'>
                <p className='hidden sm:block'>Logout</p>
                <LogOut className='text-xl' />
            </div>
     </div>
    </div>
  )
}
