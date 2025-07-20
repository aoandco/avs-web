"use client"
import React, { Suspense, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'


interface cardType{
    type: string,
    paraText1: string,
    paraText2?: string,
    children?: React.ReactNode,
    bgColor: string

}

interface taskFileType {
    _id: string,
    taskUrl: string,
    status: string,
    uploadedAt: string
} 

interface DashboardStatsType {
    todaysTasks: number,
    currentWeekTasks: number,
    completedTasks: number,
    failedTasks: number,
    inProgressTasks: number,
    verifiedAgents: number,
    notVerifiedAgents: number,
    agentComplaints: number,
    clientComplaints: number,
    taskFiles: taskFileType[]
}

 function Page() {
    const [token, setToken] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [dashboardStats, setDashboardStats] = useState<DashboardStatsType>({
        todaysTasks: 0,
        currentWeekTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        inProgressTasks: 0,
        verifiedAgents: 0,
        notVerifiedAgents: 0,
        agentComplaints: 0,
        clientComplaints: 0,
        taskFiles: []
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'text-[#178a51]';
            case 'in-progress':
                return 'text-[#ff0000]'; 
            case 'pending':
                return 'text-[#ff8c00]'; 
            default:
                return 'text-[#8a8a8a]'; 
        }
    }

    const Card = ({type,paraText1,paraText2,children, bgColor}:cardType) => {
        return (
            <div className={`${bgColor} ${type === 'first' ? "px-4 py-6" : "px-6 py-4" }  rounded-lg text-white`}>
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

    const getDashboardStats = async () => {
        axios.get('https://bayog-production.up.railway.app/v1/admin/dashboard-stats',{
            headers: {
                Authorization : `Bearer ${token}`
            }
        })
        .then((response) => {
            setDashboardStats({
                ...dashboardStats,
                ...response.data.data
            })
        })
        .catch((error)=>{
            console.error("Error fetching dashboard stats:", error.response ? error.response.data.message : "An error occurred");
            setDashboardStats({
                todaysTasks: 0,
                currentWeekTasks: 0,
                completedTasks: 0,
                failedTasks: 0,
                inProgressTasks: 0,
                verifiedAgents: 0,
                notVerifiedAgents: 0,
                agentComplaints: 0,
                clientComplaints: 0,
                taskFiles: []
            })
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }

    useEffect(()=>{
        if(token){
            getDashboardStats()
        }
    },[token])

     useEffect(() => {
        const storedToken = sessionStorage.getItem("token") || ""
        setToken(storedToken)
    }, [])

    return (
            
        <div className='flex-1 overflow-auto rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
                    <div className='p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                        <p className='text-base md:text-xl font-semibold leading-none'>Dashboard</p>
                    </div>
                    <div className='flex-1'>
                                <div className='p-3 md:p-5 lg:p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6 lg:mb-10'>
                                    
                                    <Card 
                                        type="first"
                                        paraText1="Total task today"
                                        paraText2={dashboardStats.todaysTasks.toString()}
                                        bgColor={ dashboardStats.todaysTasks == 0 ? "bg-[#8a8a8a]" : "bg-[#174795]"}
                                    />
                                    <Card 
                                        type="first"
                                        paraText1="Total task this week"
                                        paraText2={dashboardStats.currentWeekTasks.toString()}
                                        bgColor={dashboardStats.currentWeekTasks === 0 ? "bg-[#8a8a8a]" : "bg-[#174795]"}
                                    />
                                    <Card 
                                        type="first"
                                        paraText1="Completed verifications"
                                        paraText2={dashboardStats.completedTasks.toString()}
                                        bgColor={ dashboardStats.completedTasks == 0 ? "bg-[#8a8a8a]" : "bg-[#178a51]"}
                                    />
                                    <Card
                                        type="second"
                                        paraText1='Failed/Incomplete Verifications'
                                        bgColor={ dashboardStats.inProgressTasks == 0 && dashboardStats.failedTasks == 0 ? "bg-[#8a8a8a]" : "bg-[#ff0000]"}
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Incomplete</span>
                                                <span className='text-base md:text-xl'>{dashboardStats.inProgressTasks.toString()}</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Failed</span>
                                                <span className='text-base md:text-xl'>{dashboardStats.failedTasks.toString()}</span>
                                            </p>
                                        </div>
                                    </Card>
                                    <Card
                                        type="second"
                                        paraText1='Agents and Teams'
                                        bgColor={"bg-[#8a8a8a]"}
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Verified</span>
                                                <span className='text-base md:text-xl'>{dashboardStats.verifiedAgents.toString()}</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Not Verified</span>
                                                <span className='text-base md:text-xl'>{dashboardStats.notVerifiedAgents.toString()}</span>
                                            </p>
                                        </div>
                                    </Card>
                                    <Card
                                        type="second"
                                        paraText1='Complaints and issues'
                                        bgColor={ dashboardStats.agentComplaints == 0 && dashboardStats.clientComplaints == 0 ? "bg-[#8a8a8a]" :"bg-[#ff0000]"}
                                    >
                                        <div className='flex flex-col gap-2 text-white'>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Agents</span>
                                                <span className='text-base md:text-xl'>{dashboardStats.agentComplaints.toString()}</span>
                                            </p>
                                            <p className='flex justify-between'>
                                                <span className='text-base md:text-xl'>Clients</span>
                                                <span className='text-base md:text-xl'>{dashboardStats.clientComplaints.toString()}</span>
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                                <Suspense fallback={<div className="min-h-[400px] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div></div>}>
                                <div className='overflow-x-auto min-h-[200px] md:min-h-[300px] lg:min-h-[350px] bg-white rounded-lg pb-6 flex flex-col'>
                                    <div className='border-b-2 border-b-[#131313] py-4 px-6 flex flex-row justify-between items-center'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image src="/recent-icon.svg" alt='recent icon' width={16} height={16} />
                                            <p>Recent Uploads</p>
                                        </div>
                                        <Link href="/admin/tasks" className='text-base md:text-xl hover:text-[#485d3a] active:text-[#485d3a]'>View all</Link>
                                    </div>
                                    {
                                        isLoading 
                                        ?   <div className='flex-1 flex justify-center items-center'>
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#485d3a]"></div>
                                            </div> 
                                        : dashboardStats.taskFiles.length === 0
                                        ? 
                                        <div className='flex-1 flex justify-center items-center'>
                                            <div className='w-[90%] max-w-[300px] flex flex-col gap-2 items-center'>
                                                <Image src='/upload-icon.svg' alt='upload icon' width={24} height={24} />
                                                <p className='text-base md:text-xl font-semibold'>No Uploads yet</p>
                                                <p className='text-center text-sm md:text-base'>Expect to see your recent uploads appear here soon</p>
                                                <button className='cursor-pointer hover:opacity-80 active:opacity rounded-lg text-base text-white md:text-xl py-2 px-6 md:px-8 bg-[#484545]'>Upload</button>
                                            </div>
                                        </div>
                                        :
                                        <table className='w-full min-w-[375px]'>
                                        <thead>
                                            <tr className='border-b border-b-[#c4c4c4]'>
                                                <th className='text-sm sm:text-base text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]'>No</th>
                                                <th className='whitespace-normal break-words text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center'>File Name</th>
                                                <th className='whitespace-normal break-words text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center'>Date & Time</th>
                                                <th className='whitespace-normal break-words text-sm sm:text-base text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]'>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dashboardStats.taskFiles.slice(0,3).map((file, index) => (
                                                    <tr key={file._id} className='border-b border-b-[#c4c4c4]'>
                                                        <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6'>{index + 1}</td>
                                                        <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6'>
                                                            <span>{file.taskUrl.split('/').pop()}</span>
                                                        </td>
                                                        <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>{new Date(file.uploadedAt).toLocaleString()}</td>
                                                        <td className={`text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 ${getStatusColor(file.status)}`}>{file.status.charAt(0).toUpperCase() + file.status.slice(1)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    }
                                </div>
                                </Suspense>
                                </div>
                            
                    </div>
        </div>
            
  )
}

export default Page
