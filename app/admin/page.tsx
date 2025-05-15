"use client"
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import adminImg from "../assests/adminImg.png"
import Image from 'next/image'
import { useRouter } from 'next/navigation'


const page = () => {
    const router = useRouter()
    const handleRouter = (link: string) =>{
        router.push(link)
    }
  return (
    <main>
        <Navbar />
        <section className='px-[5%] bg-[#f5f9f2] py-8 md:py-12 lg:py-14 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12'>
            <div className='flex-1 lg:flex-[1.25]'>
                <p className='mt-6 text-3xl font-semibold'>Welcome!</p>
                <p className="text-[#0f170a] text-3xl font-semibold">Our Ever hard-working</p>
                <p className="text-[#0f170a] text-3xl font-semibold mb-6" >Administrator</p>
                <p className='text-base font-normal lg:w-[400px]'>
                    Admin! Ready to take charge and keep verifications running smoothly?
                </p>
                <p className='text-base mb-10 font-normal lg:w-[400px]'>
                    Log in to manage requests, assign agents, and ensure every address gets the bayog touch of trust
                </p>
                <div className='flex flex-row gap-6'>
                    <button onClick={()=>handleRouter("/admin/signup")} className='cursor-pointer w-[175px] h-[45px] rounded-lg text-white bg-[#485d3a] hover:bg-white hover:text-[#485d3a] hover:border-2 hover:border-[#485d3a] transition-all duration-500 ease-linear'>Sign Up as Admin</button>
                    <button onClick={()=>handleRouter("/admin/login")} className='cursor-pointer w-[175px] h-[45px] rounded-lg text-[#485d3a] bg-white border-2 border-[#485d3a] hover:border-0 hover:bg-[#485d3a] hover:text-white transition-all duration-500 ease-linear'>Login as Admin</button>
                </div>
            </div>
            <div className='relative admin-hero flex-1 shrink-0'>
                <div className='hidden md:block absolute top-10 left-0 -translate-x-[65%] w-[100px] lg:w-[115px] h-[30px] lg:h-[40px] rounded-lg lg:rounded-xl bg-[#D8E9CD]'></div>
                <div className='hidden md:block absolute w-[100px] lg:w-[115px] right-0 bottom-10 h-[30px] lg:h-[40px] translate-x-[35%] rounded-lg lg:rounded-xl bg-[#485D3A]' ></div>
                <Image className='block h-full w-full' src={adminImg} alt={"admin image icon"} />
            </div>
        </section>
        <Footer />
    </main>
  )
}

export default page
