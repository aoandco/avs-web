"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import emptyIcon from "../../_assests/emptyIcon.svg"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Search } from 'lucide-react';


interface AgentObj {
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    isVerified: boolean;
    completedTaskCount: number;
}


export default function Page() {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/agents-with-completed-tasks`
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
                setAgents([...response.data.data])
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
            <div className='overflow-y-auto flex-1 rounded-xl border-[1.5px] border-[#b3b3b3] flex flex-col pb-8 bg-[#f8f9fa]'>
                {/* <div className='flex flex-row gap-4 px-3 md:px-5 lg:px-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Companies</p>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Agents</p>
                </div> */}
                <div className='flex flex-row items-center justify-between p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='text-base md:text-xl font-semibold leading-none'>Agents</p>
                    <div className='bg-[#485d3a] text-white px-3 py-1 rounded-full text-sm font-medium'>
                        {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
                    </div>
                </div>
                <div className='p-3 md:p-5 lg:px-6 lg:py-3 flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-center border-b-[1.5px] border-b-[#b3b3b3]'>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='hidden sm:block text-black font-semibold text-base'>Agent Directory</p>
                        <p className='block sm:hidden text-black font-semibold text-sm'>Agent</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <Search className='absolute text-[#8a8a8a] top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                value={keyword}
                                onChange={(e) => handleSearch(e.target.value)}
                                type="text" 
                                className='w-full border-0 border-white text-black rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2'
                                placeholder='search agents'    
                            />
                        </div>
                    </div>
                    {/* <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Agent</button> */}
                </div>
                {
                    isLoading 
                    ? 
                    <div className='flex-1 flex justify-center items-center mb-4 mx-4 lg:mx-6 m-3 md:m-5 border rounded-xl border-gray-200 bg-white'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                    </div>
                    : agents.length > 0
                    ?
                    <div className="flex-1 overflow-auto mt-4 mx-4 lg:mx-6 mt-3 md:mt-5 shadow-sm border border-gray-200 rounded-lg">
                        <table className="w-full min-w-[720px] rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex flex-row gap-4 items-center">
                                        <input type="checkbox" className="w-5 h-5 accent-[#485d3a] mr-2" />
                                        <span>Full Name</span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {agents.map((agent, index) => (
                                    <tr key={index} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-6 py-4 flex flex-row gap-4 items-center">
                                            <input type="checkbox" className="w-5 h-5 accent-[#485d3a] mr-2" />
                                            <div className="flex flex-row gap-2 items-center">
                                                {agent.profileImage ? (
                                                    <Image src={agent.profileImage} alt="" className="w-[36px] h-[36px] rounded-full border border-gray-200 shadow-sm" width="36" height="36" />
                                                ) : (
                                                    <User className="w-[36px] h-[36px] rounded-full border border-gray-200 shadow-sm" />
                                                )}
                                                <span className="font-medium text-gray-900">{agent.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{agent.email.substring(0,10)}....</td>
                                        <td className="px-6 py-4 text-gray-700">{agent.phoneNumber}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${agent.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {agent.isVerified ? "Approved" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
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
