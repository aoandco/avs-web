"use client"
import React, { useEffect } from 'react'
// import profilePic from "../_assests/profilePic.png"
import { LayoutDashboard, FileText, AlertTriangle, Users, User, X, LogOut } from "lucide-react";
import Image from 'next/image'
import { useMyContext } from '@/app/context/MyContext';
import logo from "@/app/assests/logo.png"
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
    const router = useRouter()
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const pathname = usePathname();
    const {isSidebarOpen,setIsSidebarOpen ,toggleSidebar} = useMyContext()

    const isActive = (path: string) => {
        return pathname === path ? 'bg-[#9dc782] text-white' : 'bg-[#f5f5f5] text-[#8a8a8a]';
    }

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        router.push('/admin/login');
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
    <div className={`${isSidebarOpen ? 'block' 
    : !isSidebarOpen && window.innerWidth >= 1024
    ? "block" 
    :'hidden'} absolute z-10 top-0 left-0 md:shadow-xl lg:shadow-none md:shadow-md lg:shadow-none lg:relative w-[225px] rounded-tr-xl rounded-br-xl lg:rounded-none border lg:border-[1.5px] border-l-0 border-[#b3b3b3] pt-4 md:pt-10 pb-6 pl-6 pr-4 bg-[#abe08a] lg:bg-white`}>
        <X
            onClick={toggleSidebar}
            className='cursor-pointer absolute text-2xl block top-4 right-4 lg:hidden' 
        />
        <Image
            src={logo}
            height={50}
            alt="bayog log"
            className='block md:hidden'
        />
        <div className='flex flex-row gap-2 items-center'>
            {/* <Image 
                src={profilePic}
                alt="profile picture"
                className='w-[32px] xl:w-[40px] h-[32px] xl:h-[40px]'
            /> */}
            <User className='text-2xl xl:text-3xl text-[#8a8a8a]' />
            <p className='text-base text-black'>{user?.email}</p>
        </div>
        <div className='cursor-pointer flex flex-col gap-2 items-stretch mt-4'>
            <Link href='/admin/dashboard'
                onClick={()=>setIsSidebarOpen(false)}
                className={`rounded-md hover:bg-[#9dc782] p-2 hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear ${isActive('/admin/dashboard')}`}>
                <LayoutDashboard className='text-2xl' />
                <p className='text-base font-semibold'>Dashboard</p>
            </Link>
            <Link  href={'/admin/tasks'} 
                onClick={()=>setIsSidebarOpen(false)}
                className={`rounded-md hover:bg-[#9dc782] p-2 hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear ${isActive('/admin/tasks')}`}>
                <Users className='text-2xl' />
                <p className='text-base font-semibold'>Tasks</p>
            </Link>
            <Link href={'/admin/clients'} 
                onClick={()=>setIsSidebarOpen(false)}
                className={`rounded-md hover:bg-[#9dc782] p-2 hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear ${isActive('/admin/clients')}`}>
                <Users className='text-2xl' />
                <p className='text-base font-semibold'>Client</p>
            </Link>
            <Link href={'/admin/agents'}
                onClick={()=>setIsSidebarOpen(false)} 
                className={`rounded-md hover:bg-[#9dc782] p-2 hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear ${isActive('/admin/agents')}`}>
                <FileText className='text-2xl' />
                <p className='text-base font-semibold'>Agents</p>
            </Link>
            <Link href={'/admin/complaints'}
                onClick={()=>setIsSidebarOpen(false)}
                className={`rounded-md hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear ${isActive('/admin/complaints')}`}>
                <AlertTriangle className='text-2xl' />
                <p className='text-base font-semibold'>Complaints</p>

            </Link>
            {/* <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <FaUserFriends className='text-2xl' />
                <p className='text-base font-semibold'>Teams</p>
            </div>
            <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <RiAlarmWarningFill className='text-2xl' />
                <p className='text-base font-semibold'>Report</p>
            </div>
            <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <IoAnalyticsSharp className='text-2xl' />
                <p className='text-base font-semiolbd'>Analytics</p>
            </div> */}
            {/* <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <IoMdSettings className='text-2xl' />
                <p className='text-base font-semibold'>Settings</p>
            </div> */}
        </div>
        <div onClick={handleLogout} className='cursor-pointer my-4 sm:my-6  md:hidden  p-2 inline-flex flex-row gap-2 items-center rounded-md border-[1.5px] border-[#001eff]'>
            <LogOut className='text-xl' />
            <p>Log Out</p>
        </div>
    </div>

  )
}
