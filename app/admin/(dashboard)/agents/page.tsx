"use client"
import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import agentPic from "../../_assests/project-profile-image.png"
import Image from 'next/image';
import emptyIcon from "../../_assests/emptyIcon.svg"
import { useRouter } from 'next/navigation';
import axios from 'axios';


interface AgentObj {
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    isVerified: boolean;
    completedTaskCount: number;
}


export default function Page() {
    const baseUrl = "https://bayog-production.up.railway.app/v1/admin/agents-with-completed-tasks"
    const router = useRouter()
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState<string | null>(null);
    const [agents, setAgents] = useState<AgentObj[]>([])


    const handleSearch = async (value : string) => {
        setKeyword(value)
        const endpoint = `${baseUrl}?fullName=${value}`
        try{
            const response = await axios.get(endpoint,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 200){
                setAgents(response.data.data)
            }
        }catch(err){
            setAgents([])
            console.error("Error searching clients:", err);
        }
    }

    const getAgents = async () => {
        try{
            const response = await axios.get(baseUrl, {
                headers: {
                    Authorization: `Bearer ${token}`    
                }
            })
            if(response.status === 200){
                setAgents(response.data.data)
            }
        }catch(err){
            setAgents([])
            console.error("Error fetching agents:", err);

        }finally{
            setIsLoading(false)
        }
    }


    useEffect(()=>{
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            router.push("/login")
        }
    },[])

    useEffect(()=>{
        if(token){
            getAgents()
        }
    },[token])

  return (
            <div className='overflow-y-auto flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col pb-16 md:pb-20 lg:pb-24'>
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
                                value={keyword}
                                onChange={(e) => handleSearch(e.target.value)}
                                type="text" 
                                className='w-full border-0 border-white text-black rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2'
                                placeholder='search agents'    
                            />
                        </div>
                    </div>
                    <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Agent</button>
                </div>
                {
                    isLoading 
                    ? 
                    <div className='flex-1 flex justify-center items-center'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                    </div>
                    : agents.length > 0
                    ?
                    <div className='overflow-x-auto lg:overflow-x-none flex-1'>
                       <table className='table-fixed w-full min-w-[720px] '>
                            <thead>
                                <tr className='text-[#626262] border-b-[1.5px] border-b-[#b3b3b3]'>
                                    <th className='w-[1/4] text-left py-4 lg:py-6 px-4 flex flex-row gap-4 items-center'>
                                        <input type="checkbox" className='w-5 h-5' />
                                        <p>FULL NAME</p>
                                    </th>
                                    <th className='w-[1/4] text-left py-4 lg:py-6 px-4'>STAFF ID</th>
                                    <th className='w-[1/4] text-left py-4 lg:py-6  px-4'>PHONE NUMBER</th>
                                    <th className='w-[1/4] text-left py-4 lg:py-6 px-4'>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    agents.map((agent, index) => (
                                        <tr key={index} className='border-b border-b-[#a5a5a5]'>
                                            <td className='text-left py-2 md:py-3 lg:py-4 px-4 flex flex-row gap-4 items-center'>
                                                <input type="checkbox" className='w-5 h-5' />
                                                <div className='flex flex-row gap-2 items-center'>
                                                    <Image src={agent.profileImage || agentPic} alt="" className='w-[36px] h-[36px] rounded-full' width="36" height='36' />
                                                    <p>{agent.fullName}</p>
                                                </div>
                                            </td>
                                            <td className='text-left py-2 px-4'>{agent.email.substring(0,10)}....</td>
                                            <td className='text-left py-2 px-4'>{agent.phoneNumber}</td>
                                            <td className='text-left py-2 px-4'>{agent.isVerified ? "Approved" : "Pending"}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>                        
                        </table> 
                    </div>
                    : 
                    <div className='flex-1 flex justify-center items-center'>
                        <div>
                            <Image src={emptyIcon} alt="no clients icon" className='w-[150px] block mb-2 mx-auto' />
                            <p className='text-xl font-semibold mb-2 text-center'>No agents</p>
                            <p className='text-[#8a8a8a] text-base text-center'>Expect to see your agents here</p>
                        </div>
                    </div>
                }
            </div> 
  )
}
