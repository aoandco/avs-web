"use client"
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { IoSearch, IoChatbubbles } from 'react-icons/io5'
import emptyIcon from "../admin/_assests/emptyIcon.svg"
import Image from 'next/image'


interface CardType {
    num: string;
    type: string;
    color: string,
    borderColor:string
}

interface NotificationsType {
    title: string;
    message: string;
    date: string;
    time: string
}

export default function page() {
    const [isEmpty,] = useState(false)
    const Card = ({num,type,color,borderColor}:CardType)=>{
        return (
            <div className={`flex-1 border-2 ${borderColor} rounded-2xl bg-white min-h-[150px] sm:min-h-[200px] flex flex-col justify-center items-center gap-2`}>
                <p className={`${color} text-2xl sm:text-3xl font-semibold`}>{num}</p>
                <p className='text-base text-[#626262]'>{type}</p>
            </div>
        )
    }

    const Notifications = ({title,message,date,time}:NotificationsType) =>{
        return (
            <div className='mb-2 md:mb-4 bg-white rounded-xl px-6 md:px-8 lg:px-10 py-2 md:py-3 lg:py-4 flex flex-row justify-between items-center gap-4 md:gap-6 lg:gap-8'>
                <div className='flex flex-row gap-4 lg:gap-6 items-center'>
                    <IoChatbubbles className='shrink-0 text-2xl md:text-3xl text-black' />
                    <div>
                        <p className='text-base sm:text-xl font-semibold mb-2'>{title}</p>
                        <p className='text-sm sm:text-base text-[#626262]'>{message}</p>
                    </div>
                </div>
                <div className='self-stretch flex flex-col justify-between gap-4 md:gap-6 lg:gap-10'>
                    <p className='whitespace-nowrap flex flex-row gap-2 text-sm sm:text-base font-semibold font-semibold'>
                        <span>{date}</span>
                        <span>|</span>
                        <span>{time}</span>
                    </p>
                    <button className='py-3 sm:py-4 px-2 sm:px-3 text-base font-semibold bg-white border-[1.5px] border-black rounded-lg'>Open message</button>
                </div>
            </div>
        )
    }


  return (
    <main className='mx-auto w-full max-w-screen-2xl h-auto flex flex-row'>
        <Sidebar />
        <div className='bg-[#f6f6f7] flex-1 px-4 md:px-6 lg:px-8 pt-6'>
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
            </div>
            <div className='w-full mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row gap-4 md:gap-8 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl'>
                <p className='self-start md:self-center text-base font-semibold'>Filter by:</p>
                <ul className='flex flex-row gap-4 md:gap-6 lg:gap-10 items-center list-none'>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>All</li>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Messages</li>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Reports</li>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Complaints</li>
                </ul>
            </div>
            <div className='mb-4 md:mb-6 lg:mb-8 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10'>
                {
                    !isEmpty
                ?
                <> 
                <Card 
                    num={"50"}
                    type={"New Messages"}
                    color={"text-[#001eff]"}
                    borderColor={"border-[#001eff]"}
                />
                <Card 
                    num={"30"}
                    type={"New Reports"}
                    color={"text-[#178a51]"}
                    borderColor={'border-[#178a51]'}
                />
                <Card 
                    num={"3"}
                    type={"Complaints Resolution"}
                    color={"text-[#ff0000]"}
                    borderColor={'border-[#ff0000]'}
                />
                </> 
                :
                <>
                  <Card 
                    num={"0"}
                    type={"No Messages"}
                    color={"text-[#626262"}
                    borderColor={"border-[#626262]"}
                    />
                    <Card 
                        num={"0"}
                        type={"No Reports"}
                        color={"text-[#626262"}
                        borderColor={"border-[#626262]"}
                    />
                    <Card 
                        num={"0"}
                        type={"COmplaints Resolution"}
                        color={"text-[#626262"}
                        borderColor={"border-[#626262]"}
                    />
                </>
            }
            </div>
            <p className='mb-2 md:mb-4 lg:mb-6 text-base font-semibold'>All Complains List</p>
            {
                !isEmpty
                ?
            <div className='bg-[#e3e2e2] rounded-xl px-6 md:px-8 lg:px-10 py-4 md:py-6 lg:py-8 mb-4 md:mb-mb-6 lg:mb-8 min-h-[200px] md:min-h-[300px] lg:min-h-[400px]'>
                <Notifications
                    title={"Title of Notification"}
                    message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    date={"12/12/2023"}
                    time={"12:00 PM"}
                />
                <Notifications
                    title={"Title of Notification"}
                    message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    date={"12/12/2023"}
                    time={"12:00 PM"}
                />
                <Notifications
                    title={"Title of Notification"}
                    message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    date={"12/12/2023"}
                    time={"12:00 PM"}
                />
                <button className='mx-auto block text-sm py-3 px-16 md:px-20 lg:px-24 rounded-full text-white bg-[#178a51] cursor-pointer hover:opacity-80'>
                    Load More notifications
                </button>
            </div>
            : 
            <div className='bg-[#e3e2e2] rounded-xl px-6 md:px-8 lg:px-10 py-4 md:py-6 lg:py-8 mb-4 md:mb-mb-6 lg:mb-8 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex justify-center ityems-center'>
                <div className='flex-1 flex justify-center items-center'>
                    <div>
                        <Image src={emptyIcon} alt="no clients icon" className='w-[150px] block mb-2 mx-auto' />
                        <p className='text-xl font-semibold mb-2 text-center'>No Notifications at this time</p>
                        <p className='text-[#8a8a8a] text-base text-center'>Expect to see messages here soon</p>
                    </div>
                </div>    
            </div>
            }
        </div>
    </main>
  )
}
