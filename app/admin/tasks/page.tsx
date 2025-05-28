"use client"
import React, { useState } from 'react'
import Header from '../_components/Header'
import Sidebar from '../_components/Sidebar'
import { IoSearch } from "react-icons/io5";
import fileIcon from "../_assests/file-icon.png"
import Image, { StaticImageData } from 'next/image';
import emptyIcon from "../_assests/emptyIcon.svg"


 function Page() {
    const [isEmpty,] = useState(false)

    const FileComp = ({icon , file, bgColor}:{icon: StaticImageData, file: string, bgColor: string}) =>{
        return (
            <div className='rounded-md flex flex-row gap-6 px-2 py-2 items-center bg-white'>
                <div className={`flex justify-center items-center ${bgColor} h-[36px] w-[36px] rounded-md`}>
                    <Image className="scale-80" src={icon} alt="" />
                </div>
                <p className='text-base font-semibold'>{file}</p>
            </div>
        )
    }

  return (
    <main className='w-[95%] mx-auto max-w-screen-xl h-auto flex flex-col'>
        <Header />
        <section className='flex-1 flex flex-col lg:flex-row gap-6 mb-4'>
            <Sidebar />
            <div className='flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
                <div className='flex flex-row gap-4 px-3 md:px-5 lg:px-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Companies</p>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Employees</p>
                </div>  
                <div className='p-3 md:p-5 lg:px-6 lg:py-3 flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-center border-b-[1.5px] border-b-[#b3b3b3]'>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='text-black font-semibold text-sm sm:text-base'>46 Companies</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <IoSearch className='absolute text-[#8a8a8a] top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                type="text" 
                                className='w-full border-0 border-white rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2'
                                placeholder='search companies'    
                            />
                        </div>
                    </div>
                    <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Clients</button>
                </div>
                {
                    !isEmpty
                    ? 
                    <div className='p-3 md:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                        <FileComp 
                            icon={fileIcon}
                            file={"Bigbee Company"}
                            bgColor={"bg-[#562cf1]"}
                        />
                    </div>
                    : 
                    <div className='flex-1 flex justify-center items-center'>
                        <div>
                            <Image src={emptyIcon} alt="no clients icon" className='w-[150px] block mb-2 mx-auto' />
                            <p className='text-xl font-semibold mb-2 text-center'>No clients</p>
                            <p className='text-[#8a8a8a] text-base text-center'>Expect to see your clients here</p>
                        </div>
                    </div>
                }
            </div>
        </section>  
    </main>
  )
}

export default Page
