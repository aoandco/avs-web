"use client"
import React, { useEffect } from 'react'
import bayog from "../assests/logo.png"
import Image from "next/image"
import { LayoutDashboard, CheckCircle, BarChart3, MessageSquareWarning, X } from 'lucide-react';
import { useMyContext } from '../context/MyContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';


export default function Sidebar() {
    const {isSidebarOpen,setIsSidebarOpen, toggleSidebar} = useMyContext()
    const router = useRouter()
    const pathname = usePathname();

    const handleRouter = (link: string) =>{
            router.push(link)
        }

    useEffect(()=>{
        const handleResize = () => {
            if(window.innerWidth >= 1024){
                setIsSidebarOpen(true);
            }
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize); 
        }
    }, [])


    return (
    <div className={`h-screen lg:h-auto absolute top-0 left-0 lg:relative z-10 shrink-0 w-[200px] xl:w-[250px] bg-white px-3 pt-8 lg:pt-6 ${isSidebarOpen ? 'block' 
    : !isSidebarOpen && window.innerWidth >= 1024
    ? "block" 
    :'hidden'}`}>
        <X 
            onClick={toggleSidebar}
            className='cursor-pointer text-2xl lg:hidden absolute top-4 right-4' 
        />
        <div 
            className='cursor-pointer mb-4 md:mb-6 lg:mb-8 flex justify-center items-center'
            onClick={()=> {handleRouter('/dashboard'); setIsSidebarOpen(false)}}
            >
            <Image 
                src={bayog} 
                alt="company logo" 
                height={60}
                />
        </div>
        <p className='text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-base font-semibold text-[#2d3429]'>Verification Portal</p>
        <ul className='flex flex-col gap-6'>
            <li 
                className={`cursor-pointer flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white ${pathname === '/dashboard' ? ' bg-[#485d3a] text-white' : ''}`}
                onClick={()=> {handleRouter('/dashboard'); setIsSidebarOpen(false)}}
                >
                <LayoutDashboard className='text-2xl' />
                <p className='text-base font-semibold'>Dashboard</p>
            </li>
            <li 
                onClick={()=>{handleRouter('/notifications');setIsSidebarOpen(false)}}
                className={`cursor-pointer flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white ${pathname === '/notifications' ? ' bg-[#485d3a] text-white' : ''}`}>
                <CheckCircle className='text-2xl' />
                <p className='text-base font-semibold'>Notifications</p>
            </li>
            <li 
                onClick={()=>{handleRouter('/analytics');setIsSidebarOpen(false)}}
                className={`cursor-pointer flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white ${pathname === '/analytics' ? ' bg-[#485d3a] text-white' : ''} `}>
                <BarChart3 className='text-2xl' />
                <p className='text-base font-semibold'>Analytics</p>
            </li>
            <li 
                onClick={()=>{handleRouter('/complains');setIsSidebarOpen(false)}}
                className={`cursor-pointer flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white ${pathname === '/complains' ? ' bg-[#485d3a] text-white' : ''}`}>
                <MessageSquareWarning className='text-2xl' />
                <p className='text-base font-semibold'>Complains</p>
            </li>
        </ul>
    </div>
  )
}
