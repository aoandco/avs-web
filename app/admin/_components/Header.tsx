"use client"
import React from 'react'
import logo from "@/app/assests/logo.png"
import { LogOut, Menu } from "lucide-react";
import Image from 'next/image';
import { useMyContext } from '@/app/context/MyContext';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const { toggleSidebar } = useMyContext()

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        router.push('/admin/login');
    }

  return (
    <header className='flex justify-between items-center py-2'>
        <Image
            src={logo}
            height={60}
            alt="bayog logo"
        />
        {/* <div className='relative hidden md:block w-[200px] md:w-[300px] lg:w-[400px]'>
            <IoSearch className='absolute left-2 md:left-4 top-[50%] -translate-y-[50%]' />
            <input className='h-full w-full py-2 pl-10 md:pl-12 pr-2 md:pr-4 text-base border border-[#b3b3b3] rounded-full'  type="text" placeholder='Search by file, address, refrence number' />
        </div> */}
        <div className='hidden md:flex flex-row gap-2 items-center'>
            {/* <div className='p-1 rounded-md border-[1.5px] border-[#626262]'>
                <div className='relative'>
                    <IoNotifications className='text-2xl text-[#626262]' /> 
                    <span className='absolute text-xs text-white top-0 right-0 bg-[#e71f1f] h-[12px] w-[12px] rounded-full flex justify-center items-center'>2</span>
                </div>
            </div> */}
            <div onClick={handleLogout} className='cursor-pointer rounded-lg p-2 border-2 border-[#9fe273] flex flex-row gap-3 items-center hover:border-red-500 hover:bg-red-500 hover:text-white'>
                <LogOut className='text-2xl' />
                <span className='text-base'>Log Out</span>
            </div>
            <Menu
                onClick={toggleSidebar}
                className="hidden md:block lg:hidden text-2xl" 
            />    
        </div>
        <Menu
            onClick={toggleSidebar} 
            className="cursor-pointer block md:hidden text-2xl" 
        />
    </header>
  )
}
