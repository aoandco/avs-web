"use client"
import React, { useState } from 'react'
import Header from '../_components/Header'
import Sidebar from '../_components/Sidebar'
import recentIcon from "../_assests/recent-icon.svg"
import uploadIcon from "../_assests/upload-icon.svg"
import Image from 'next/image'

interface cardType{
    type: string,
    paraText1: string,
    paraText2?: string,
    children?: React.ReactNode,
    bgColor: string

}

export default function page() {
    const [isEmpty,setIsEmpty] = useState(false)

    const Card = ({type,paraText1,paraText2,children, bgColor}:cardType) => {
        return (
            <div className={`${bgColor} ${type === 'first' ? "px-6 py-8" : "px-8 py-6" }  rounded-lg text-white`}>
                {
                    type == "first"
                    ? 
                    <>
                        <p className='text-end text-xl font-semibold mb-4'>{paraText1}</p>
                        <p className='text-end text-xl font-semibold'>{paraText2}</p>
                    </>
                    : 
                    <>
                        <p className='text-center text-xl font-semibold mb-4'>{paraText1}</p>
                        {children}
                    </>
                }
            </div>
        )
    }

    return (
        <main className='bg-[#f6f6f7] h-auto flex flex-col'>
            <Header />
            <section className='flex-1 w-[95%] mx-auto max-w-screen-xl flex flex-row gap-6 mb-4'>
                <Sidebar />
                <div className='flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
                    <div className='p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                        <p className='text-base md:text-xl font-semibold leading-none'>Dashboard</p>
                    </div>
                    <div className='flex-1'>
                        {
                            !isEmpty
                            ? (
                                <div className='p-3 md:p-5 lg:p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6 lg:mb-10'>
                                    <Card 
                                        type="first"
                                        paraText1="Total task today"
                                        paraText2="150"
                                        bgColor="bg-[#174795]"
                                    />
                                    <Card 
                                        type="first"
                                        paraText1="Total task this week"
                                        paraText2="1000"
                                        bgColor="bg-[#174795]"
                                    />
                                    <Card 
                                        type="first"
                                        paraText1="Completed verifications"
                                        paraText2="94"
                                        bgColor="bg-[#178a51]"
                                    />
                                    <Card
                                        type="second"
                                        paraText1='Failed/Incomplete Verifications'
                                        bgColor="bg-[#ff0000]"
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Incomplete</span>
                                                <span className='text-base md:text-xl'>5</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Failed</span>
                                                <span className='text-base md:text-xl'>9</span>
                                            </p>
                                        </div>
                                    </Card>
                                    <Card
                                        type="second"
                                        paraText1='Agents and Teams'
                                        bgColor="bg-[#8a8a8a]"
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Incomplete</span>
                                                <span className='text-base md:text-xl'>5</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Failed</span>
                                                <span className='text-base md:text-xl'>9</span>
                                            </p>
                                        </div>
                                    </Card>
                                    <Card
                                        type="second"
                                        paraText1='Complaints and issues'
                                        bgColor="bg-[#ff0000]"
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Agents</span>
                                                <span className='text-base md:text-xl'>5</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Clients</span>
                                                <span className='text-base md:text-xl'>5</span>
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                                <div className='h-[200px] md:min-h-[300px] lg:min-h-[350px] bg-white rounded-lg pb-6'>
                                    <div className="border-b-2 border-b-[#131313] py-4 px-6 flex flex-row justify-between items-center">
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={recentIcon} alt='recent icon' />
                                            <p>Recent Uploads</p>
                                        </div>
                                        <p>View all</p>
                                    </div>
                                    <table className='w-full'>
                                        <thead>
                                            <tr className='border-b border-b-[#c4c4c4]'>
                                                <th className='text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]'>No</th>
                                                <th className='py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center'>File Name</th>
                                                <th className='py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center'>Date & Time</th>
                                                <th className='text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]'>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='border-b border-b-[#c4c4c4]'>
                                                <td className='py-2 md:py-4 px-4 md:px-6'>01</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                                <td className='py-2 md:py-4 px-4 md:px-6 text-[#178a51]'>Verified</td>
                                            </tr>
                                            <tr className='border-b border-b-[#c4c4c4]'>
                                                <td className='py-2 md:py-4 px-4 md:px-6'>02</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                                <td className='py-2 md:py-4 px-4 md:px-6 text-[#178a51]'>Verified</td>
                                            </tr>
                                            <tr className='border-b border-b-[#c4c4c4]'>
                                                <td className='py-2 md:py-4 px-4 md:px-6'>03</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                                <td className='py-2 md:py-4 px-4 md:px-6 text-[#ff0000]'>In Progress</td>
                                            </tr>
                                            <tr className='border-b border-b-[#c4c4c4]'>
                                                <td className='py-2 md:py-4 px-4 md:px-6'>04</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                                <td className='text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                                <td className='py-2 md:py-4 px-4 md:px-6 text-[#ff0000]'>In Progress</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                            )
                            
                            : 
                            <div className='p-3 md:p-5 lg:p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6 lg:mb-10'>
                                    <Card 
                                        type="first"
                                        paraText1="Total task today"
                                        paraText2="0"
                                        bgColor="bg-[#8a8a8a]"
                                    />
                                    <Card 
                                        type="first"
                                        paraText1="Total task this week"
                                        paraText2="0"
                                        bgColor="bg-[#8a8a8a]"
                                    />
                                    <Card 
                                        type="first"
                                        paraText1="Completed verifications"
                                        paraText2="0"
                                        bgColor="bg-[#8a8a8a]"
                                    />
                                    <Card
                                        type="second"
                                        paraText1='Failed/Incomplete Verifications'
                                        bgColor="bg-[#8a8a8a]"
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Incomplete</span>
                                                <span className='text-base md:text-xl'>0</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Failed</span>
                                                <span className='text-base md:text-xl'>0</span>
                                            </p>
                                        </div>
                                    </Card>
                                    <Card
                                        type="second"
                                        paraText1='Agents and Teams'
                                        bgColor="bg-[#8a8a8a]"
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Incomplete</span>
                                                <span className='text-base md:text-xl'>0</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Failed</span>
                                                <span className='text-base md:text-xl'>0</span>
                                            </p>
                                        </div>
                                    </Card>
                                    <Card
                                        type="second"
                                        paraText1='Complaints and issues'
                                        bgColor="bg-[#8a8a8a]"
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Agents</span>
                                                <span className='text-base md:text-xl'>0</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Clients</span>
                                                <span className='text-base md:text-xl'>0</span>
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                                <div className='flex flex-col h-[200px] md:min-h-[300px] lg:min-h-[350px] bg-white rounded-lg pb-6'>
                                    <div className="border-b-2 border-b-[#131313] py-4 px-6 flex flex-row justify-between items-center">
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src={recentIcon} alt='recent icon' />
                                            <p>Recent Uploads</p>
                                        </div>
                                        <p>View all</p>
                                    </div>
                                    <div className='flex-1 flex justify-center items-center'>
                                        <div className='w-[90%] max-w-[300px] flex flex-col gap-2 items-center'>
                                            <Image src={uploadIcon} alt='upload icon' />
                                            <p className='text-base md:text-xl font-semibold'>No Uploads yet</p>
                                            <p className='text-center text-sm md:text-base'>Expect to see your recent uploads appear here soon</p>
                                            <button className='cursor-pointer hover:opacity-80 active:opacity rounded-lg text-base text-white md:text-xl py-2 px-6 md:px-8 bg-[#484545]'>Upload</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>
        </main>
  )
}
