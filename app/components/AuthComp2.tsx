import Image from 'next/image'
import React from 'react'
import logo from "../assests/logo.png"

export default function AuthComp2() {
  return (
    <div className='hidden md:block relative leading-none flex-1 bg-[#f5f9f2] text-[#0f170a] p-4 md:p-6 lg:p-10 pt-6'>
      <Image 
        src={logo} 
        alt='bayog logo' 
        height={60}
        className='cursor-pointer'
      />
      <div className='md:px-6 lg:px-10 w-full absolute top-[50%] left-[50%] -translate-[50%]'>
        <p className="text-xl font-semibold">Hey! Admin</p>
        <p className="text-xl font-semibold mb-4">Carry on with Hardwork and dedication</p>

        <p className='text-xs mb-4'>Provide all essential detials as an admin of Bayog and carry out carry out role professionally</p>
        <div className='flex flex-row gap-4 justify-center items-center'>
            <div className='scale-90 bg-[#8a8a8a] w-3 h-3 rounded-full'></div>
            <div className='w-3 h-3 rounded-full bg-[#0f170a]'></div>
            <div className='scale-90 bg-[#8a8a8a] w-3 h-3 rounded-full'></div>
        </div>
      </div>
    </div>
  )
}
