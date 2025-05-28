import React, { useEffect } from 'react'
import profilePic from "../_assests/profilePic.png"
import { RiDashboardHorizontalFill,RiFileList2Fill, RiAlarmWarningFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { IoAnalyticsSharp} from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { IoMdClose } from "react-icons/io"
import { useMyContext } from '@/app/context/MyContext';
import logo from "@/app/assests/logo.png"
import { MdLogout } from "react-icons/md";

export default function Sidebar() {
    const {isSidebarOpen,setIsSidebarOpen ,toggleSidebar} = useMyContext()
    const router = useRouter()
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
    <div className={`${isSidebarOpen ? 'block' : 'hidden'} absolute z-10 top-0 left-0 md:shadow-xl lg:shadow-none md:shadow-md lg:shadow-none lg:relative w-[225px] xl:w-[250px] rounded-tr-xl rounded-br-xl lg:rounded-none border lg:border-[1.5px] border-l-0 border-[#b3b3b3] pt-4 md:pt-10 pb-6 pl-6 pr-4 bg-[#abe08a] lg:bg-white`}>
        <IoMdClose
            onClick={toggleSidebar}
            className='cursor-pointer absolute text-2xl block top-4 right-4 lg:hidden' 
        />
        <Image
            src={logo}
            height={50}
            alt="bayog logo"
            className='block md:hidden'
        />
        <div className='flex flex-row gap-2 items-center'>
            <Image 
                src={profilePic}
                alt="profile picture"
                className='w-[32px] xl:w-[40px] h-[32px] xl:h-[40px]'
            />
            <p className='text-base text-black'>ceo@bayog.com</p>
        </div>
        <div className='cursor-pointer flex flex-col gap-2 items-stretch mt-4'>
            <div onClick={()=>handleRouter('/admin/dashboard')} className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <RiDashboardHorizontalFill className='text-2xl' />
                <p className='text-base font-semibold'>Dashboard</p>
            </div>
            <div onClick={()=>handleRouter('/admin/tasks')} className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <FaUserFriends className='text-2xl' />
                <p className='text-base font-semibold'>Tasks</p>
            </div>
            <div onClick={()=>handleRouter('/admin/clients')} className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <FaUserFriends className='text-2xl' />
                <p className='text-base font-semibold'>Client</p>
            </div>
            <div onClick={()=>handleRouter('/admin/projects')} className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <RiFileList2Fill className='text-2xl' />
                <p className='text-base font-semibold'>Projects</p>
            </div>
            <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
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
            </div>
            <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <IoMdSettings className='text-2xl' />
                <p className='text-base font-semibold'>Settings</p>
            </div>
        </div>
        <div className='cursor-pointer my-4 sm:my-6 md:hidden p-2 inline-flex flex-row gap-2 items-center rounded-md border-[1.5px] border-[#001eff]'>
            <MdLogout className='text-xl' />
            <p>Log Out</p>
        </div>
    </div>

  )
}
