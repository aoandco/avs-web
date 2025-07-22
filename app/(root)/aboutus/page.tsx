import React, { Suspense } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';


const page = () => {
  return (
    <main>
        <section className='px-[5%] bg-[#d8e9cd] py-8 md:py-12 lg:py-14 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16'>
            <div className='shrink-0 flex-1 hidden md:flex flex-col items-center'>
                <p className='text-xl font-semibold mb-2'>About Us</p>
                <p className='text-xl font-semibold'>Our Team</p>
            </div>
            <div className='flex-[2] lg:flex-[3]'>
                <p className='text-3xl mb-4 font-semibold text-center md:text-start'>About Us</p>
                <p className='text-base md:text-xl lg:w-[650px] mb-4 text-center md:text-start'>
                    Bayog is a leading customer verification agency dedicated to helping businesses confirm the authenticity of their clients&apos; 
                    addresses. We bridge the gap between trust and truth by sending trained agents to physically verify residential and business locations. 
                    With real-time updates, photo evidence, and detailed reports, we make verification fast, reliable, and stress-free. At Bayog, we believe that accurate 
                    information builds stronger, safer, and more transparent customer relationships.
                </p>
                <p className='text-base md:text-xl lg:w-[650px] mb-4 text-center md:text-start'>
                    Our team is made up of passionate professionals who understand the value of trust in business. 
                    From experienced verification agents to dedicated support staff and developers, we all work together to ensure a seamless verification experience. 
                    Each agent is well-trained, courteous, and committed to providing accurate, on-the-ground feedback. 
                    We&apos;re here to support your business with real people doing real work.
                </p>

            </div>
        </section>
        <Suspense fallback={<div className="min-h-[400px] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div></div>}>
        <section className='px-[5%] bg-[#f5f9f2] py-8 md:py-12 lg:py-14'>
            <div className='flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-10 xl:gap-12 items-center'>
                <div className='flex-[2]'>
                    <p className='text-2xl font-semibold mb-4'>Our Mission</p>
                    <p className='text-base md:w-[320px]'>
                        Our mission at Bayog is to build trust through accurate and reliable address verification.
                        We are committed to helping businesses make informed decisions by delivering real-world, 
                        on-site confirmations with speed, clarity, and transparency.
                    </p> 
                </div>
                <div className='flex-1 hidden sm:block'>
                    <Image className='block h-full w-full' src='/aboutUnion1.png' alt="about union" width={50} height={50} />
                </div> 
            </div> 
            <div className='flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-10 xl:gap-12 items-center mt-6 md:mt-8 lg:mt-10 xl:mt-14'>
                <div className='flex-1 hidden sm:block'>
                    <Image className='block h-full w-full' src='/aboutUnion1.png' alt="about union" width={50} height={50} />
                </div>
                <div className='flex-[2] flex justify-end'>
                    <div>
                        <p className='text-2xl font-semibold mb-4'>Our Vision</p>
                        <p className='text-base md:w-[300px]'>
                            Our vision is to become the most trusted verification partner for businesses across Africa and beyond. 
                            We aim to set the standard for physical address verification through innovation, integrity, and exceptional service delivery.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section className='px-[5%] bg-white py-8 md:py-12 lg:py-14 flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center'>
            <div className='flex-[1.5]'>
                <p className='text-2xl font-semibold mb-4'>Contact Information</p>
                <p className='text-base md:w-[240px]'>Feel free to contact us at anytime and we will get back to you</p>          
            </div>
            <div className='flex-1'>
                <div className='w-[355px] text-white py-6 px-8 bg-[#485d3a] rounded-lg'>
                    <p className='text-xl font-semibold mb-6'>Info</p>
                    <div className='ml-2 flex flex-row gap-6 items-center mb-6'>
                        <Mail className='text-xl' />
                        <p>Bayogassociates@gmail.com</p> 
                    </div>
                    <div className='ml-2 flex flex-row gap-6 items-center mb-6'>
                        <Phone className='text-xl' />
                        <p>+234 7011122234</p>
                    </div>
                    <div className='ml-2 flex flex-row gap-6 items-center mb-6'>
                        <MapPin  className='text-xl'/>
                        <p>123, Admiralty way, Sabo Yaba,<br /> Lagos state</p>
                    </div>
                    <div className='ml-2 flex flex-row gap-6 items-center mb-6'>
                        <Clock className='text-xl' />
                        <p> 9:00am - 7:00pm</p>
                    </div>
                </div>

            </div>
        </section>
        </Suspense>
    </main>
  )
}

export default page
