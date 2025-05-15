import React from 'react'
import profilePic from "../_assests/profilePic.png"
import projectIcon from "../_assests/project-icon.png" 
import { RiDashboardHorizontalFill,RiFileList2Fill, RiAlarmWarningFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { IoAnalyticsSharp} from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import Image from 'next/image'
import { useRouter } from 'next/navigation';


export default function Sidebar() {
    const router = useRouter()
    const handleRouter = (link: string) =>{
        router.push(link)
    }
  return (
    <div className='w-[250px] border-[1.5px] border-[#b3b3b3] pt-10 pl-6 pr-4 bg-white'>
        <div className='flex flex-row gap-2 items-center'>
            <Image 
                src={profilePic}
                alt="profile picture"
                className='w-[40px] h-[40px]'
            />
            <p className='text-base text-black'>ceo@bayog.com</p>
        </div>
        <div className='flex flex-col gap-2 items-stretch mt-4'>
            <div onClick={()=>handleRouter('/admin/dashboard')} className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <RiDashboardHorizontalFill className='text-2xl' />
                <p className='text-base font-semibold'>Dashboard</p>
            </div>
            <div onClick={()=>handleRouter('/admin/tasks')} className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <FaUserFriends className='text-2xl' />
                <p className='text-base font-semibold'>Tasks</p>
            </div>
            <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
                <FaUserFriends className='text-2xl' />
                <p className='text-base font-semibold'>Client</p>
            </div>
            <div className='rounded-md bg-[#f5f5f5] hover:bg-[#9dc782] p-2 text-[#8a8a8a] hover:text-white flex flex-row gap-2 items-center transition-all duration-300 ease-linear'>
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
                <p className='text-base font-semibold'>Analytics</p>
            </div>
        </div>
    </div>

  )
}
