"use client"
import { apiBase } from "@/lib/apiBase";
import { ui } from "@/lib/uiClasses";
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
    const baseUrl = `${apiBase()}/v1/admin/agents-with-completed-tasks`
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
            <div className={`${ui.panel} pb-8`}>
                <div className={ui.panelHeader}>
                    <p className='text-base md:text-xl font-semibold leading-none'>Agents</p>
                    <div className={ui.countBadge}>
                        {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
                    </div>
                </div>
                <div className={ui.panelToolbar}>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='hidden sm:block text-brand-700 font-semibold text-base'>Agent Directory</p>
                        <p className='block sm:hidden text-brand-700 font-semibold text-sm'>Agent</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <Search className='absolute text-brand-400 top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                value={keyword}
                                onChange={(e) => handleSearch(e.target.value)}
                                type="text" 
                                className={ui.searchInput}
                                placeholder='search agents'    
                            />
                        </div>
                    </div>
                    {/* <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Agent</button> */}
                </div>
                {
                    isLoading 
                    ? 
                    <div className={ui.loadingBox}>
                        <div className={ui.spinner}></div>
                    </div>
                    : agents.length > 0
                    ?
                    <div className={`${ui.tableCard} mt-4 mx-4 lg:mx-6 md:mt-5`}>
                        <table className={`${ui.table} min-w-[720px]`}>
                            <thead>
                                <tr>
                                    <th className="flex flex-row gap-4 items-center">
                                        <input type="checkbox" className="w-5 h-5 accent-brand-500 mr-2" />
                                        <span>Full Name</span>
                                    </th>
                                    <th>Staff ID</th>
                                    <th>Phone Number</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map((agent, index) => (
                                    <tr key={index}>
                                        <td className="flex flex-row gap-4 items-center">
                                            <input type="checkbox" className="w-5 h-5 accent-brand-500 mr-2" />
                                            <div className="flex flex-row gap-2 items-center">
                                                {agent.profileImage ? (
                                                    <Image src={agent.profileImage} alt="" className="w-[36px] h-[36px] rounded-full border border-brand-200 shadow-sm" width="36" height="36" />
                                                ) : (
                                                    <User className="w-[36px] h-[36px] rounded-full border border-brand-200 shadow-sm text-brand-400" />
                                                )}
                                                <span className="font-medium text-brand-700">{agent.fullName}</span>
                                            </div>
                                        </td>
                                        <td>{agent.email.substring(0,10)}....</td>
                                        <td>{agent.phoneNumber}</td>
                                        <td>
                                            <span className={`${ui.badge} ${agent.isVerified ? "ui-badge--success" : "ui-badge--warning"}`}>
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
