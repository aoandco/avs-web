/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import axios from 'axios';
import React, {FormEvent, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { X } from "lucide-react"

interface AgentObj {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    isVerified: boolean;
    completedTaskCount: number;
}

interface taskModalType {
    handleClose : () => void,
    taskIds : string[],
    activityId: string | null,
    getTasks: () => void
}


export default function TaskModal({handleClose,taskIds,activityId,getTasks} : taskModalType) {
    const token = sessionStorage.getItem("token");
    const [agents, setAgents] = useState<AgentObj[]>([]);
    const [agentId, setAgentId] = useState<string>("");
    const [loading,setLoading] = useState(false)
    const getAgents = async ()=>{
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/agents-with-completed-tasks`
        try {
            const response = await axios.get(endpoint,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setAgents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
            setAgents([]);
        }
    }

    const assignTaskAgent = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!agentId || taskIds.length === 0) return;
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/assign-task/${agentId}`;
        setLoading(true)
        try {
            const response = await axios.post(endpoint, {
                taskIds: taskIds
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                getTasks()
                setTimeout(()=>{
                    handleClose()
                }, 1000)
            }
        } catch (error: any) {
            console.error("Error assigning task:", error);
            toast.error(error.response ? error.response.data.message : "Failed to assign task");
        }finally{
            setLoading(false)
        }
    }


    useEffect(() => {
        if(token) {
            getAgents();
        }
    }, []);

    return (
    <div className='fixed inset-0 flex items-center justify-center w-full h-full z-10'>
        <Toaster />
      <div 
        onClick={handleClose}
       className='absolute top-0 left-0 w-full h-full bg-black opacity-70'></div>
      <div className='relative z-20 bg-white rounded-lg pt-4 px-4 pb-8 max-w-xl w-full'>
        <X onClick={handleClose} className='absolute top-4 right-4 cursor-pointer' />
        <h2 className='text-xl font-semibold mb-8 text-center'>Assign Agent To Task</h2>
        <form onSubmit={assignTaskAgent} className='space-y-6'>
            <div className='pl-0 sm:pl-4 md:pl-6 flex flex-row items-center font-semibold text-base pb-2 border-b border-b-black'>
                <p className='flex-1'>Task ID</p>
                <p className='flex-[1.5] text-center'>{activityId}</p>
            </div>
            <div className='pl-0 sm:pl-4 md:pl-6 flex flex-col sm:flex-row sm:items-center'>
                <label className='flex-1 font-semibold text-base'>Select Agent</label>
                <select
                    name={"agentId"} 
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className=' flex-[1.5] border border-black rounded-md p-2'>
                        <option value="">Select an agent</option>
                        {
                            agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.fullName}
                                </option>
                            ))
                        }
                </select>
            </div>
            <div className='flex flex-row justify-end gap-4 sm:gap-6'>
                <button
                    onClick={handleClose}
                    className='cursor-pointer py-3 font-medium w-[150px] sm:w-[200px] border border-black rounded-md bg-transparent hover:bg-gray-100 hover:border-gray-700 transition-all duration-200'>Cancel</button>
                <button 
                    type='submit'
                    disabled={loading}
                    className={`cursor-pointer disabled:cursor-not-allowed font-medium w-[150px] sm:w-[200px] py-3 rounded-md transition-all duration-200 ${
                        loading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-[#b1d29b] hover:bg-[#a0c78a] hover:shadow-md active:scale-95'
                    }`}>
                    {
                        loading ? "assigning..." : "Assign to Agent"
                    }
                </button>
            </div>      
        </form>
      </div>
    </div>
  )
}
