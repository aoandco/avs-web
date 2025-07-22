"use client"
import React, { useState, useEffect } from 'react'
import { Inbox } from "lucide-react";
import dynamic from 'next/dynamic'

const Line = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Line })), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-64">Loading chart...</div>
})

const Bar = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Bar })), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-64">Loading chart...</div>
})


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
import type { ChartData, ChartOptions} from "chart.js"
import { useRouter } from 'next/navigation';
import axios from 'axios';

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

interface monthlyTasksType {
    month: string,
    pending: number,
    verified: number,
    total: number
}

interface AnalyticsDataType {
    totalRequest: number;
    totalPending: number;
    totalVerified: number;
    monthlyTasks: monthlyTasksType[];
}

export default function Page() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType>({
        totalRequest: 0,
        totalPending: 0,
        totalVerified: 0,
        monthlyTasks: []
    });
    const [isEmpty,] = useState(false)
    
    const chartData = React.useMemo(() => {
        
        const lineData: ChartData<'line'> = {
            labels: [...analyticsData.monthlyTasks.map(task => task.month)],
            datasets: [
            //     {
            //     label: "Total Request",
            //     data: [4100,4100,3950,3950,3600],
            //     backgroundColor: '#1877f2',
            //     borderColor: '#1877f2' 
            // },
            {
                label: "Total Pending",
                data: [...analyticsData.monthlyTasks.map(task => task.pending)],
                backgroundColor: "#ff0000",
                borderColor: "#ff0000"
            },
            {
                label: "Total Verified",
                data: [...analyticsData.monthlyTasks.map(task => task.verified)],
                backgroundColor: "#178a51",
                borderColor: "#178a51"  
            }
            ]
        }

        const barData : ChartData<'bar'> = {
            labels: [...analyticsData.monthlyTasks.map(task => task.month)],
            datasets: [
                {
                    label: "Total Verified",
                    data: [...analyticsData.monthlyTasks.map(task => task.verified)],
                    backgroundColor: '#178a51'
                },
                {
                    label: "Total Pending",
                    data: [...analyticsData.monthlyTasks.map(task => task.pending)],
                    backgroundColor: "#ff0000",
                    borderColor: "#ff0000"
                }
            ]
        }

        return { lineData, barData }
    }, [analyticsData.monthlyTasks]);

    const chartOptions = React.useMemo(() => {
        const lineOptions: ChartOptions<'line'> = {
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
                // max: 1000,      
                ticks: {
                    stepSize: 1 
                    }
                }
            }
        }

        const barOptions: ChartOptions<'bar'> = {
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

        return { lineOptions, barOptions }
    }, [analyticsData.monthlyTasks]);

    const getAnalytics = async () => {
        const baseUrl = "https://bayog-production.up.railway.app/v1/client/task-analytics";
        try {
            const response = await axios.get(baseUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setAnalyticsData({...response.data.data});
            ;
            } else {
                console.error("Failed to fetch analytics data");
                setAnalyticsData({
                    totalRequest: 0,
                    totalPending: 0,
                    totalVerified: 0,
                    monthlyTasks: []
                }); 
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setAnalyticsData({
                totalRequest: 0,
                totalPending: 0,
                totalVerified: 0,
                monthlyTasks: []
            });
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {;
            setToken(token);
        } else {
            router.push('/login');
        }
    }, [])

     useEffect(()=>{
        if(token){
            getAnalytics();
        }
    },[token])

  return (
        <>
            {/* <div>
                <div className='mb-4 md:mb-6 lg:mb-8 relative h-auto'>
                    <IoSearch className='text-xl text-[#8a8a8a] absolute top-[50%] -translate-y-[50%] left-8' />
                    <input 
                        type="text"
                        placeholder='Search by address, reference number' 
                        className='w-full pl-16 py-3 pr-2 bg-white rounded-2xl outline-none'
                    />
                </div>
            </div> */}
            {/* <div className='mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row gap-4 md:gap-8 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl'>
                <select className='border-2 border-[#485d3a] rounded-xl p-2 self-start md:self-center text-base font-semibold'>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <ul className='flex flex-row gap-4 md:gap-6 lg:gap-10 items-center list-none'>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Report</li>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Pending</li>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Verified</li>
                    <li className='cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl bg-[#e3e2e2] text-[#0f170a] hover:bg-[#485d3a] hover:text-white'>Complains</li>
                </ul>
            </div> */}
            <p className='mb-2 md:m-3 lg:mb-4 font-semibold text-base lg:text-xl'>Report Analysis</p>
            <div className={`mb-6 md:mb-8 lg:mb-10 rounded-lg bg-white py-2 md:py-4 px-4 md:px-6 lg:px-8 min-h-[250px] md:min-h-[300px] lg:min-h-[350px] ${isEmpty ? "flex justify-center items-center": "block"}`}>
                {
                isEmpty
                ?
                <div className='text-[#8a8a8a] flex flex-col gap-2 justify-center items-center'>
                    <Inbox className='text-6xl' />
                    <p className='text-xl font-semibold'>No results Found</p>
                    <p className='font-semibold w-auto md:w-[300px] text-center'>No data found at this moment please check back later</p>
                </div>
                :
                <>
                <div>
                    {/* <select className='rounded-lg border-[1.5px] border-black py-2 px-4'>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>  */}
                </div>    
                <div className='flex flex-col sm:flex-row gap-4 md:gap-6 gap-8'>
                <div className='overflow-x-auto'>
                <div className="py-3 md:py-4 lg:py-5 sm:flex-1 h-[450px] min-w-[350px]">
                    <Line data={chartData.lineData} options={chartOptions.lineOptions} />
                </div>
                </div>
                <div className="self-start sm:self-end py-4 px-6 lg:px-8 border border-[#8a8a8a] rounded-md min-w-[225px]">
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
                        <p className='text-base'>Total Request: {analyticsData.totalRequest}</p>
                        <p className='text-base'>Total Verified: {analyticsData.totalVerified}</p>
                        <p className='text-base'>Total pending: {analyticsData.totalPending}</p>
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
                        <Inbox className='text-6xl' />
                        <p className='text-xl font-semibold'>No results Found</p>
                        <p className='font-semibold w-auto md:w-[300px] text-center'>No data found at this moment please check back later</p>
                    </div>
                    :
                <> 
                <div>
                    {/* <select className='rounded-lg border-[1.5px] border-black py-2 px-4'>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>  */}
                </div>
                <div className='py-4 md:py-5 lg:py-7 flex flex-col sm:flex-row gap-4 md:gap-6 gap-8'>
                   <div className='overflow-x-auto'>
                    <div className="sm:flex-1 h-[350px] min-w-[400px]">
                        <Bar data={chartData.barData} options={chartOptions.barOptions} />
                    </div>
                    </div>
                    <div className="self-start sm:self-end py-4 px-6 lg:px-8 border border-[#8a8a8a] rounded-md min-w-[225px]">
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
                            <p className='text-base'>Total Verified: {analyticsData.totalVerified}</p>
                            <p className='text-base'>Total pending: {analyticsData.totalPending}</p>
                        </div>
                    </div>
                </div>
                </>  
                }
            </div>
        </>
  )
}
