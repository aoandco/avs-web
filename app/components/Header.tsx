import React from 'react'
import { MdOutlineLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMyContext } from '../context/MyContext';


export default function Header() {
    const {toggleSidebar} = useMyContext()
  return (
    <div className='mb-4 md:mb-6 lg:mb-8 flex flex-row justify-between items-center'>
        <div onClick={toggleSidebar} className='flex flex-col gap-1 cursor-pointer'>
            <p className='text-base sm:text-xl font-semibold'>Hello,</p>
            <p className='text-base sm:text-xl'>Unilever  Nigeria LTD</p>
        </div> 
        <div className='flex flex-row gap-4 items-center'>
            <div className='w-[32px] sm:w-[40px] h-[32px] sm:h-[40px] rounded-full bg-[#d9d9d9] flex justify-center items-center'>
                <FaUser className='text-base sm:text-xl text-black' />
            </div>
            <div className='cursor-pointer text-sm sm:text-base font-semibold flex flex-row gap-2 items-center justify-center'>
                <p>Logout</p>
                <MdOutlineLogout className='text-xl' />
            </div>
     </div>
    </div>
  )
}
