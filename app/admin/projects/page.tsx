"use client"
import React from 'react'
import Header from '../_components/Header'
import Sidebar from '../_components/Sidebar'
import { IoSearch } from "react-icons/io5";
import agentPic from "../_assests/project-profile-image.png"
import Image from 'next/image';
import emptyIcon from "../_assests/emptyIcon.svg"

export default function Page() {
    const [isEmpty,] = React.useState(false)
  return (
    <main className='w-[95%] mx-auto max-w-screen-xl h-auto flex flex-col'>
        <Header />
        <section className='flex-1  flex flex-col lg:flex-row gap-6 mb-4'>
            <Sidebar />  
            <div className='flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
                <div className='flex flex-row gap-4 px-3 md:px-5 lg:px-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Companies</p>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Agents</p>
                </div>
                <div className='p-3 md:p-5 lg:px-6 lg:py-3 flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-center border-b-[1.5px] border-b-[#b3b3b3]'>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='hidden sm:block text-black font-semibold text-base'>Agent Directory</p>
                        <p className='block sm:hidden text-black font-semibold text-sm'>Agent</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <IoSearch className='absolute text-[#8a8a8a] top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                type="text" 
                                className='w-full border-0 border-white rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2'
                                placeholder='search agents'    
                            />
                        </div>
                    </div>
                    <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Agent</button>
                </div>
                {
                    !isEmpty
                    ?
                    <div className='overflow-x-auto w-full'>
                       <table className='table-fixed w-full min-w-[720px]'>
                            <thead>
                                <tr className='text-[#626262] border-b-[1.5px] border-b-[#b3b3b3]'>
                                    <th className='w-[1/4] text-left py-4 lg:py-6 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <p>FULL NAME</p>
                                    </th>
                                    <th className='w-[1/4] text-left py-4 lg:py-6 px-4'>STAFF ID</th>
                                    <th className='w-[1/4] text-left py-4 lg:py-6  px-4'>TEAM</th>
                                    <th className='w-[1/4] text-left py-4 lg:py-6 px-4'>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='border-b border-b-[#a5a5a5]'>
                                    <td className='text-left py-2 md:py-3 lg:py-4 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={agentPic} alt="" className='w-[36px] h-[36px] rounded-full' />
                                            <p>Vivian Aloge</p>
                                        </div>
                                    </td>
                                    <td className='text-left py-2 px-4'>ID34569</td>
                                    <td className='text-left py-2 px-4'>Lagos</td>
                                    <td className='text-left py-2 px-4'>Approved</td>
                                </tr>
                                <tr className='border-b border-b-[#a5a5a5]'>
                                    <td className='text-left py-2 md:py-3 lg:py-4 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={agentPic} alt="" className='w-[36px] h-[36px] rounded-full' />
                                            <p>Vivian Aloge</p>
                                        </div>
                                    </td>
                                    <td className='text-left py-2 px-4'>ID34569</td>
                                    <td className='text-left py-2 px-4'>Lagos</td>
                                    <td className='text-left py-2 px-4'>Approved</td>
                                </tr>
                                <tr className='border-b border-b-[#a5a5a5]'>
                                    <td className='text-left py-2 md:py-3 lg:py-4 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={agentPic} alt="" className='w-[36px] h-[36px] rounded-full' />
                                            <p>Vivian Aloge</p>
                                        </div>
                                    </td>
                                    <td className='text-left py-2 px-4'>ID34569</td>
                                    <td className='text-left py-2 px-4'>Lagos</td>
                                    <td className='text-left py-2 px-4'>Approved</td>
                                </tr>
                                <tr className='border-b border-b-[#a5a5a5]'>
                                    <td className='text-left py-2 md:py-3 lg:py-4 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={agentPic} alt="" className='w-[36px] h-[36px] rounded-full' />
                                            <p>Vivian Aloge</p>
                                        </div>
                                    </td>
                                    <td className='text-left py-2 px-4'>ID34569</td>
                                    <td className='text-left py-2 px-4'>Lagos</td>
                                    <td className='text-left py-2 px-4'>Approved</td>
                                </tr>
                                <tr className='border-b border-b-[#a5a5a5]'>
                                    <td className='text-left py-2 md:py-3 lg:py-4 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={agentPic} alt="" className='w-[36px] h-[36px] rounded-full' />
                                            <p>Vivian Aloge</p>
                                        </div>
                                    </td>
                                    <td className='text-left py-2 px-4'>ID34569</td>
                                    <td className='text-left py-2 px-4'>Lagos</td>
                                    <td className='text-left py-2 px-4'>Approved</td>
                                </tr>
                                <tr className='border-b border-b-[#a5a5a5]'>
                                    <td className='text-left py-2 md:py-3 lg:py-4 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={agentPic} alt="" className='w-[36px] h-[36px] rounded-full' />
                                            <p>Vivian Aloge</p>
                                        </div>
                                    </td>
                                    <td className='text-left py-2 px-4'>ID34569</td>
                                    <td className='text-left py-2 px-4'>Lagos</td>
                                    <td className='text-left py-2 px-4'>Approved</td>
                                </tr>
                            </tbody>                        
                        </table> 
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
