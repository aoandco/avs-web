"use client"
import React, { useEffect, useState } from 'react'
import bayog from "../assests/logo.png"
import Image from "next/image"
import { RiDashboardHorizontalFill,RiFileList2Fill, RiAlarmWarningFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoAnalyticsSharp} from "react-icons/io5";
import { PiUserSoundFill } from "react-icons/pi";
import { useMyContext } from '../context/MyContext';


export default function Sidebar() {
    const {isSidebarOpen,setIsSidebarOpen, toggleSidebar} = useMyContext()
  
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
    <div className={`h-screen lg:h-auto absolute top-0 left-0 lg:relative shrink-0 w-[200px] xl:w-[250px] bg-white px-3 pt-6 ${isSidebarOpen ? "block": "hidden"}  }`}>
        <div className='mb-4 md:mb-6 lg:mb-8 flex justify-center items-center'>
            <Image
                onClick={toggleSidebar} 
                src={bayog} 
                alt="company logo" 
                height={60}
                />
        </div>
        <p className='text-center mb-4 md:mb-6 lg:mb-8 text-base font-semibold text-[#2d3429]'>Verification Portal</p>
        <ul className='flex flex-col gap-6'>
            <li className='flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white'>
                <RiDashboardHorizontalFill className='text-2xl' />
                <p className='text-base font-semibold'>Dashboard</p>
            </li>
            <li className='flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white'>
                <IoIosCheckmarkCircle className='text-2xl' />
                <p className='text-base font-semibold'>Notifications</p>
            </li>
            <li className='flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white'>
                <IoAnalyticsSharp className='text-2xl' />
                <p className='text-base font-semibold'>Analytics</p>
            </li>
            <li className='flex flex-row justify-center items-center px-2 md:px-4 py-2 gap-3 rounded-md text-[#485d3a] hover:bg-[#485d3a] hover:text-white'>
                <PiUserSoundFill className='text-2xl' />
                <p className='text-base font-semibold'>Complains</p>
            </li>
        </ul>
    </div>
  )
}
