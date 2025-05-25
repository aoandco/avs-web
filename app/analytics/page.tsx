"use client"
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { IoSearch } from 'react-icons/io5'
import{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import type { ChartData, ChartOptions} from "chart.js"
import { PiEmptyBold } from "react-icons/pi";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Tooltip,
    Legend,
    Title
)


export default function page() {
    const [isEmpty,] = useState(false)
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
        },
        {
            label: "Total Verified",
            data: [3900,3900,3500,3500,3000],
            backgroundColor: "#178a51",
            borderColor: "#178a51"  
        }
        ]
    }

    const data2 : ChartData<'bar'> = {
        labels: labels.slice(0,5),
        datasets: [
            {
                label: "Total Verified",
                data: [3700,3650,3100,2900,2700],
                backgroundColor: '#178a51'
            },
            {
                label: "Total Pending",
                data: [400,500,500,1200,1600],
                backgroundColor: "#ff0000",
                borderColor: "#ff0000"
            }
        ]
    }

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
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

    const options2: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend:{
                display: false,
            },
            title: {
                display: false
            }
        }
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
            </div>
            <div className='mb-4 md:mb-6 lg:mb-8 flex flex-row gap-4 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl'>
                <select className='text-base font-semibold'>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <ul className='flex flex-row gap-4 md:gap-6 lg:gap-10 items-center list-none'>
                    <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Report</li>
                    <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Pending</li>
                    <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Verified</li>
                    <li className='text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Complains</li>
                </ul>
            </div>
            <p className='mb-2 md:m-3 lg:mb-4 font-semibold text-base lg:text-xl'>Report Analysis</p>
            <div className={`mb-6 md:mb-8 lg:mb-10 rounded-lg bg-white py-2 md:py-4 px-4 md:px-6 lg:px-8 min-h-[250px] md:min-h-[300px] lg:min-h-[350px] ${isEmpty ? "flex justify-center items-center": "block"}`}>
                {
                isEmpty
                ?
                <div className='text-[#8a8a8a] flex flex-col gap-2 justify-center items-center'>
                    <PiEmptyBold className='text-6xl' />
                    <p className='text-xl font-semibold'>No results Found</p>
                    <p className='font-semibold w-auto md:w-[300px] text-center'>No data found at this moment please check back later</p>
                </div>
                :
                <>
                <div>
                    <select className='rounded-lg border-[1.5px] border-black py-2 px-4'>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select> 
                </div>    
                <div className='flex flex-row gap-4 md:gap-6 gap-8'>
                <div className="py-3 md:py-4 lg:py-5 flex-1">
                    <Line data={data} options={options} />
                </div>
                <div className="self-end py-4 px-6 lg:px-8 border border-[#8a8a8a] rounded-md min-w-[225px]">
                    <div className='flex flex-col gap-4 pb-3 border-b border-[#8a8a8a] mb-3'>
                        <div className='flex flex-row justify-between items-center'>
                            <span className='h-[20px] w-[20px] rounded-full bg-[#1877f2]'></span>
                            <p className='text-base text-[#1877f2]'>Total Request</p>
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <span className='h-[20px] w-[20px] rounded-full bg-[#ff0000]'></span>
                            <p className='text-[#ff0000]'>Total Pending</p>
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <span className='h-[20px] w-[20px] rounded-full bg-[#178a51]'></span>
                            <p className='text-[#178a51]'>Total Verified</p>
                        </div>    
                    </div>
                    <div className='flex flex-col gap-3'>
                        <p className='text-xl font-semibold'>Current Statistics</p>
                        <p className='text-base'>Total Request: 4590</p>
                        <p className='text-base'>Total Verified: 3925</p>
                        <p className='text-base'>Total pending: 1720</p>
                    </div>
                </div>
                </div>
                </>
                }
            </div>
            <p className='mb-2 md:m-3 lg:mb-4 font-semibold text-base lg:text-xl'>Pending/Verified Analysis</p>
            <div className={`mb-6 md:mb-8 lg:mb-10 rounded-lg bg-white py-2 md:py-4 px-4 md:px-6 lg:px-8 min-h-[250px] md:min-h-[300px] lg:min-h-[350px] ${isEmpty ? "flex justify-center items-center": "block"}`}>
                {
                    isEmpty
                    ?
                    <div className='text-[#8a8a8a] flex flex-col gap-2 justify-center items-center'>
                        <PiEmptyBold className='text-6xl' />
                        <p className='text-xl font-semibold'>No results Found</p>
                        <p className='font-semibold w-auto md:w-[300px] text-center'>No data found at this moment please check back later</p>
                    </div>
                    :
                <> 
                <div>
                    <select className='rounded-lg border-[1.5px] border-black py-2 px-4'>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select> 
                </div>
                <div className='py-4 md:py-5 lg:py-7 flex flex-row gap-4 md:gap-6 gap-8'>
                    <div className="flex-1">
                        <Bar data={data2} options={options2} />
                    </div>
                    <div className="self-end py-4 px-6 lg:px-8 border border-[#8a8a8a] rounded-md min-w-[225px]">
                        <div className='flex flex-col gap-4 pb-3 border-b border-[#8a8a8a] mb-3'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='h-[20px] w-[20px] rounded-full bg-[#ff0000]'></span>
                                <p className='text-[#ff0000]'>Total Pending</p>
                            </div>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='h-[20px] w-[20px] rounded-full bg-[#178a51]'></span>
                                <p className='text-[#178a51]'>Total Verified</p>
                            </div>    
                        </div>
                        <div className='flex flex-col gap-3'>
                            <p className='text-xl font-semibold'>Current Statistics</p>
                            <p className='text-base'>Total Verified: 3925</p>
                            <p className='text-base'>Total pending: 1720</p>
                        </div>
                    </div>
                </div>
                </>  
                }
            </div>
        </div>   
    </main>
  )
}
