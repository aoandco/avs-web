"use client"
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { IoSearch } from "react-icons/io5";
import emptyIcon from "../admin/_assests/emptyIcon.svg"
import Image from 'next/image';

interface ComplainType {
    title: string;
    desc: string;
    date: string;
    time: string;
    status: string;
    id: string;
    color: string
} 

export default function Page() {
    const [isEmpty,] = useState(false)
    const Complain = ({title,desc,date,time,status,id,color}:  ComplainType) => {
        return (
            <div className='mb2 md:mb-4 lg:mb-6 px-4 md:px-6 py-4 md:py-6 rounded-xl bg-white'>
                <div className='flex flex-row justify-between items-center mb-2 md:mb-3 lg:mb-4'>
                    <p className='text-base font-semibold'>{title}</p>
                    <p className={`px-4 py-2 rounded-full text-white ${color} hover:opacity-80`}>{status}</p>
                </div>
                <p className='text-[#626262] mb-2 md:mb-3 lg:mb-4'>{desc}</p>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row gap-2 font-semibold'>
                        <p>{date}</p>
                        <p>|</p>
                        <p>{time}</p>
                    </div>
                    <p className='font-semibold text-base'>{id}</p>
                </div>
            </div>

        )
    } 
  return (
    <main className='mx-auto w-full max-w-screen-2xl bg-[#f6f6f7] h-auto flex flex-row'>
        <Sidebar />
        <div className='flex-1 px-4 md:px-6 lg:px-8 pt-6'>
            <Header />
            <div>
                <div className='mb-4 md:mb-6 lg:mb-8 relative h-auto'>
                    <IoSearch className='text-xl text-[#8a8a8a] absolute top-[50%] -translate-y-[50%] left-8' />
                    <input 
                        type="text" 
                        placeholder='Search by address, reference number' 
                        className='w-full pl-16 py-3 pr-2 bg-white rounded-2xl outline-none'
                    />
                </div>
                <div className='mb-4 md:mb-6 lg:mb-8 flex flex-row gap-4 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl'>
                    <p className='text-base font-semibold'>Filter by:</p>
                    <ul className='flex flex-row gap-4 md:gap-6 lg:gap-10 items-center list-none'>
                        <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>All</li>
                        <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Opened</li>
                        <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>In review</li>
                        <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Resolved</li>
                    </ul>
                </div>
                <div className='py-3 px-4 rounded-xl bg-white'>
                    <p className='text-[#8a8a8a] text-xl font-semibold mb-3'>Title Of Complaint</p>
                    <textarea className='w-full h-[150px] resize-y text-[#8a8a8a]' name="" id="" placeholder='write your complains'>

                    </textarea>
                </div>
                <button className='my-3 md:my-5 lg:my-7 mx-auto text-sm px-16 py-2 rounded-xl block text-white bg-[#485d3a] cursor-pointer hover:opacity-80'>
                    Submit
                </button>
                <p className='mb-2 md:mb-4 lg:mb-6 text-base font-semibold'>All Complains List</p>
                <div className='bg-[#e3e2e2] rounded-xl px-6 md:px-8 lg:px-10 py-4 md:py-6 lg:py-8 mb-4 md:mb-mb-6 lg:mb-8'>
                    {
                    !isEmpty 
                    ?
                    <>
                    <Complain 
                        title='Title of complain'
                        desc='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.'
                        date='12/12/2023'
                        time='12:00 PM'
                        status='Open'
                        id='1234567890'
                        color='bg-[#c837ab]'
                    />
                    <Complain 
                        title='Title of complain'
                        desc='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.'
                        date='12/12/2023'
                        time='12:00 PM'
                        status='In review'
                        id='1234567890'
                        color='bg-[#1877f2]'
                    />
                    <Complain 
                        title='Title of complain'
                        desc='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.'
                        date='12/12/2023'
                        time='12:00 PM'
                        status='Resolved'
                        id='1234567890'
                        color="bg-[#178a51]"
                    />
                    <Complain 
                        title='Title of complain'
                        desc='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.'
                        date='12/12/2023'
                        time='12:00 PM'
                        status='Open'
                        id='1234567890'
                        color="bg-[#c837ab]"
                    />
                    <button className='mx-auto block text-sm py-3 px-16 md:px-20 lg:px-24 rounded-full text-white bg-[#178a51] cursor-pointer hover:opacity-80'>
                        Load More complains
                    </button>
                    </>
                    : 
                     <div className='flex-1 flex justify-center items-center min-h-[200px] md:min-h-[300px] lg:min-h-[400px]'>
                        <div>
                            <Image src={emptyIcon} alt="no clients icon" className='w-[150px] block mb-2 mx-auto' />
                            <p className='text-xl font-semibold mb-2 text-center'>No clients</p>
                            <p className='text-[#8a8a8a] text-base text-center'>Expect to see your clients here</p>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    </main>
  )
}
