"use client"
import React, {MouseEvent} from 'react'
import AuthComp2 from '../../components/AuthComp2'
import Link from 'next/link'
import { PiEyeLight, PiEyeSlashLight } from 'react-icons/pi'
import { useRouter } from 'next/navigation'


function Page() {
    const router = useRouter()

    const handleRouter = (link: string) =>{
        router.push(link)
    }
  return (
    <div className='h-screen flex flex-row'>
        <AuthComp2 />
        <div className='relative leading-none flex-1 lg:flex-[2] xl:flex-[3] pb-6 lg:pb-10 px-4 md:px-6 lg:px-10 xl:px-14 pt-6'>
            <p className='text-end text-base font-semibold pb-3'>Don&apos;t have an account? <Link href="/admin/signup" className='text-[#213bff]'>Sign Up</Link></p> 
            <hr className='border-t-2'></hr>
            <div className='px-4 md:px-6 lg:px-10 xl:px-14 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-full'>
                <h2 className='leading-none text-2xl font-semibold mb-4'>Welcome Back</h2>
                <form>
                    <label className=' mb-2 block text-sm font-semibold' htmlFor="">Email address</label>
                    <input className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black w-full" type="text" name="" id="" />
                    <div className='flex flex-row gap-8 mb-8'>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="">Password</label>
                            <div className="relative mb-3 w-full">
                                <input className="mb-3 px-2 py-2 md:py-3 block rounded-md border border-black h-full w-full" type="text" name="" id="" />
                                <PiEyeSlashLight className='absolute absolute top-[50%] right-2 -translate-y-[50%]' />
                                <PiEyeLight className='hidden absolute top-[50%] right-2 -translate-y-[50%]' />
                            </div>                         
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button
                            onClick={(e: MouseEvent<HTMLButtonElement>)=>{e.preventDefault();handleRouter("/admin/dashboard")}} 
                            className='cursor-pointer py-3 px-14 rounded-md bg-[#485d3a] text-white hover:opacity-85 active:opacity-85 transition-all duration-500 ease-linear'
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Page
