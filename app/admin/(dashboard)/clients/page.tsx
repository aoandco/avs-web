"use client"
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import Image from 'next/image';
import emptyIcon from "../../_assests/emptyIcon.svg"
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ClientObj {
    id: string;
    companyName: string;
    email: string;
    uploaderName: string;
    uploaderPhone: string;
    taskUploads: {
        taskUrl: string;
        uploadedAt: string;
    }[];
}



export default function Page() {
    const [keyowrd, setKeyword] = useState("");
    const router = useRouter()
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/clients-task-uploads`
    const [token, setToken] = useState<string | null>(null);
    const [clients, setClients] = useState<ClientObj[]>([])
    const [isLoading, setIsLoading] = useState(true)


    const ClientComp = ({name, id}:{name: string, id: string}) => {
    return (
        <div className='rounded-md bg-white h-[100px] shadow-md hover:shadow-none'>
            <div className='flex flex-row items-stretch h-[36px] border-b-[1.5px]  border-b-[#ececec]'>
                <div className='flex-1'></div>
                <p className='flex items-center pl-2 border-l-[1.5px]  border-l-[#ececec] flex-[3] font-semibold text-base'>{name}</p>
            </div>
            <div className='pl-2 md:pl-4 lg:pl-6 pb-4 mt-2 md:mt-3 lg:mt-4'>
                {/* <p onClick={() => router.push("/admin/clients")} className='cursor-pointer text-[#8a8a8a] text-base mb-2 mb:mb-3 lg:mb-4'>Open projects</p> */}
                <p className='cursor-pointer text-[#8a8a8a] text-base inline' onClick={()=>router.push(`/admin/clients/${id}`)}>Client History</p>
            </div> 
        </div>
    )
  }


    const getClients = async () =>{
        try{
            const response = await axios.get(baseUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) 
            if(response.status === 200){
                setClients(response.data.data)
            }
        }catch(err){
            setClients([])
            console.error("Error fetching clients:", err);
        }finally{
            setIsLoading(false)
        }

    } 

    const handleSearch = async (value : string) => {
        setKeyword(value)
        const endpoint = `${baseUrl}?companyName=${value}`
        try{
            const response = await axios.get(endpoint,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 200){
                setClients(response.data.data)
            }
        }catch(err){
            setClients([])
            console.error("Error searching clients:", err);
        }
    }

    useEffect(()=>{
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }else{
           router.push("/login")
        }
    },[])

    useEffect(()=>{
        if(token){
            getClients()
        }
    },[token])

    return (
    
            <div className='overflow-auto flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
                {/* <div className='flex flex-row gap-4 px-3 md:px-5 lg:px-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Companies</p>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Employees</p>
                </div>   */}
                <div className='flex flex-row justify-between items-center p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='text-base md:text-xl font-semibold leading-none'>Clients</p>
                    <div className='bg-[#485d3a] text-white px-3 py-1 rounded-full text-sm font-medium'>
                        {clients.length} {clients.length === 1 ? 'client' : 'clients'}
                    </div>
                </div>
                <div className='p-3 md:p-5 lg:px-6 lg:py-3 flex flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-center border-b-[1.5px] border-b-[#b3b3b3]'>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='text-black font-semibold text-sm sm:text-base'>{clients.length} Companies</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <Search className='absolute text-[#8a8a8a] top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                value={keyowrd}
                                onChange={(e) => handleSearch(e.target.value)}
                                type="text" 
                                className='w-full border-0 text-black border-white rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2'
                                placeholder='search companies'    
                            />
                        </div>
                    </div>
                    {/* <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Clients</button> */}
                </div>
                {
                    isLoading
                    ?  <div className='flex-1 flex justify-center items-center'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                    </div>
                    : clients.length > 0
                    ?
                    <div className='flex-1 overflow-hidden p-3 md:p-5 lg:p-6'>
                        <div className='h-full overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                            {
                                clients.map((client, index) => (
                                    <ClientComp 
                                        key={index}
                                        name={client.companyName}
                                        id={client.id}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    : 
                    <div className='flex-1 flex justify-center items-center'>
                        <div>
                            <Image src={emptyIcon} alt="no clients icon" className='w-[150px] block mb-2 mx-auto' />
                            <p className='text-xl font-semibold mb-2 text-center'>No clients</p>
                            <p className='text-[#8a8a8a] text-base text-center'>Expect to see your clients here</p>
                        </div>
                    </div>
                }
            </div>
  )
}
