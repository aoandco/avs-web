"use client"
import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { IoSearch } from "react-icons/io5";
import { MdUpload } from "react-icons/md";
import Image from 'next/image';
import recentIcon from "../admin/_assests/recent-icon.svg"
import uploadIcon from "../admin/_assests/upload-icon.svg"
import{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from "chart.js"
import { Line } from "react-chartjs-2"
import type { ChartData, ChartOptions} from "chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
)

export default function page() {
    const [isEmpty,] = React.useState(false)

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const data: ChartData<'line'> = {
        labels: labels.slice(0,5),
        datasets: [{
            label: "Total Request",
            data: [4100,4100,3950,3950,3600],
            backgroundColor: '#1877f2',
            borderColor: '#1877f2'
        },
        {
            label: "Total Pending",
            data: [100,1000,800,800,1200],
            backgroundColor: "#ff0000",
            borderColor: "#ff0000"
        }
        ,
        {
          label: "Total Verified",
          data: [3900,3900,3500,3500,3000],
          backgroundColor: "#178a51",
          borderColor: "#178a51"  
        }
    ]
    }

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top"
            },
            title: {
                display: false,
                text: 'Chart.js Line Chart'
            }
        },
        scales:{
            y: {
            min: 0,        
            max: 5000,      
            ticks: {
                stepSize: 1000 
                }
            }
        }
    }

    const Card = ({number,desc,color}:{number: number, desc: string,color:string})=>{
        return (
            <div className={`rounded-xl flex-1 flex flex-col justify-center items-center border-[1.5px] border-[#485d3a] ${color}`}>
                <p className='text-2xl font-semibold'>{number}</p>
                <p className='text-base font-semibold'>{desc}</p>
            </div>
        )
    }
  return (
    <main className='bg-[#f6f6f7] h-auto flex flex-row'> 
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
                <div className='flex flex-row justify-between gap-5 md:gap-6 lg:gap-8'>
                    <div className='flex flex-col gap-4 w-[200px] md:w-[250px] lg:w-[300px]'>
                        <div className='bg-[#485d3a] rounded-lg py-4 md:py-5 lg:py-7 flex flex-row gap-3 justify-center items-center text-white'>
                            <MdUpload className='text-3xl'/>
                            <div>
                                <p className='text-base font-semibold'>Upload Addresses</p>
                                <p className='text-sm font-normal' >Excel file</p>
                            </div>
                        </div>
                        <div className='bg-white rounded-lg py-4 md:py-5 lg:py-7 flex flex-row gap-3 justify-center items-center border-[1.5px] border-[#485d3a] text-[#485d3a]'>
                            <p className='text-base font-semibold'>Upload History</p>
                        </div>
                    </div>
                    <div className='flex-1 flex flow-row gap-3 md:gap-4 lg:gap-6'>
                    <Card
                        number={50}
                        desc={"Files pending"}
                        color={"text-[#ff0000]"}
                    />
                    <Card
                        number={27}
                        desc={"Files verified"}
                        color={"text-[#178a51]"} 
                    />
                    <Card
                        number={2}
                        desc={"Complains"}
                        color={"text-[#ff0000]"}
                    />
                    </div>
                </div>
                {
                    !isEmpty
                    ?
                    <>
                    <div className='h-[200px] md:min-h-[300px] lg:min-h-[350px] bg-white rounded-lg pb-6 mb-4 md:mb-6 lg:mb-8'>
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
                    <div className='mb-3 md:mb-4 lg:mb-5 rounded-lg bg-white py-2 md:py-4 px-4 md:px-6 lg:px-8'>
                        <p className='text-xl font-semibold mb-2'>Upload History</p>
                        <select className='rounded-lg border-[1.5px] border-black py-2 px-4'>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <div className="py-3 md:py-4 lg:py-5 w-full h-[300px] md:min-h-[350px] lg:min-h-[450px]">
                            <Line data={data} options={options} />
                        </div>
                    </div>
                    </>
                    :
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
                }
            </div>
        </div>
    </main>
  )
}
