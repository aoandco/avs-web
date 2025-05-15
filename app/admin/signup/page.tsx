"use client"
import React from 'react'
import AuthComp2 from '../../components/AuthComp2'
import Link from 'next/link'
import { PiEyeLight,PiEyeSlashLight } from "react-icons/pi";

export default function page() {
  return (
    <div className='h-screen flex flex-row'>
        <AuthComp2 />
        <div className='leading-none flex-1 md:flex-[1.5] lg:flex-[2] xl:flex-[3] pr-4 md:pr-6 lg:pr-8 xl:pr-10 pb-6 lg:pb-8 xl:pb-10 pl-4 md:pl-6 lg:pl-10 xl:pl-14 pt-6'>
           <p className='text-end text-base font-semibold pb-3'>Already have an account? <Link href="/admin/login" className='text-[#213bff]'>Sign In</Link></p> 
            <hr className='border-t-2'></hr>
            <div className="py-4 lg:py-6 px-0 lg:px-10 xl:px-14">
                <h2 className='leading-none text-2xl font-semibold mb-4'>Let&apos;s get Started</h2>
                <form>
                    <label className=' mb-2 block text-sm font-semibold' htmlFor="">Full name of Admin</label>
                    <input className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black w-full" type="text" name="" id="" />
                    <label htmlFor="" className='mb-2 block text-sm font-semibold'>Email address</label>
                    <input className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black w-full" type="text" name="" id="" />
                    <div className='flex flex-row gap-8'>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="">Security Question</label>
                            <input className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black w-full" type="text" name="" id="" />
                        </div>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="">Phone Number</label>
                            <input className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black w-full" type="text" name="" id="" />
                        </div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="">Password</label>
                            <div className="relative mb-3 w-full">
                                <input className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black h-full w-full" type="text" name="" id="" />
                                <PiEyeSlashLight className='absolute absolute top-[50%] right-2 -translate-y-[50%]' />
                                <PiEyeLight className='hidden absolute top-[50%] right-2 -translate-y-[50%]' />
                            </div>                         
                        </div>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="">Confirm Password</label>
                            <div className="relative mb-3 w-full">
                                <input  className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black h-full w-full" type="text" name="" id="" />
                                <PiEyeSlashLight className='absolute absolute top-[50%] right-2 -translate-y-[50%]' />
                                <PiEyeLight className='hidden absolute absolute top-[50%] right-2 -translate-y-[50%]' />
                            </div> 
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 items-center mb-6'>
                        <input className='h-4 w-4' type="checkbox" name="" id="" />
                        <label className="text-sm font-semibold" htmlFor="">Agree to the <Link className='text-[#213bff]' href="">terms</Link> and <Link className='text-[#213bff]' href="">conditions</Link></label>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button className='h-[40px] w-[215px] rounded-md bg-[#485d3a] hover:bg-white text-white hover:text-[#485d3a] hover:border-2 hover:border-[#485d3a] transition-all duration-500 ease-linear'>Get Started</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
