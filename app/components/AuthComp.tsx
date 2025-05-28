import Image from 'next/image'
import React from 'react'
import logo from "../assests/logo.png"
import Link from 'next/link'

export default function AuthComp() {
  return (
    <div className='hidden md:block relative leading-none flex-1 bg-[#f5f9f2] text-[#0f170a] p-6 md:p-8 lg:p-10 pt-6'>
      <Link href="/">
      <Image 
        src={logo} 
        alt='bayog logo' 
        height={60}
        className='cursor-pointer'
      />
      </Link>
      <div className='px-10 w-full absolute top-[50%] left-[50%] -translate-[50%]'>
        <p className="text-2xl font-semibold mb-4">Let&apos;s Help you do<br /> the Running Around</p>
        <p className='text-xs mb-12'>We verify the detials in the best way<br /> possible to save you all hitches</p>
        <div className='flex flex-row gap-4 justify-center items-center'>
            <div className='scale-90 bg-[#8a8a8a] w-3 h-3 rounded-full'></div>
            <div className='w-3 h-3 rounded-full bg-[#0f170a]'></div>
            <div className='scale-90 bg-[#8a8a8a] w-3 h-3 rounded-full'></div>
        </div>
      </div>
    </div>
  )
}
