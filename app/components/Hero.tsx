import React from 'react'
import heroImg from "../assests/heroImg.png"
import Image from 'next/image'


const Hero = () => {
  return (
    <section className='py-6 sm:py-10 lg:py-14 px-[5%] flex flex-col md:flex-row gap-8 md:gap-[5%] justify-between items-start'>
        <div className='flex-[1.5]'>
            <p className='font-semibold text-3xl mt-4 lg:mt-8 text-[#0f170a]'>Bringing Trust To Every Door</p>
            <p className='font-semibold text-3xl mb-3 lg:mb-6 text-[#0f170a]'>Step, State, Region and Province</p>
            <p className='w-auto md:w-[390px] text-base font-medium text-[#0f170a] mb-8 lg:mb-12'>We help you verify so you dont have to worry. Trust us to do the best work within the shortest possible time</p>
            <button className='bg-[#485d3a] text-white text-base font-medium w-[225px] h-[45px] rounded-lg hover:bg-white hover:text-[#485d3a] hover:border-2 hover:border-[#485d3a] hover:text-[#485d3a] transition-all duration-500 ease-linear'>
                Get Started to Upload
            </button>
        </div>
        <div className='flex-1 w-full md:w-auto'>
            <Image className='block h-full w-full' src={heroImg} alt="hero section image"/>
        </div>
    </section>
  )
}

export default Hero
