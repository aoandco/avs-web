"use client"
import { apiBase } from "@/lib/apiBase";
import { ui } from "@/lib/uiClasses";
import React, { useEffect, useState } from 'react'
import { Search, KeyRound, Plug } from 'lucide-react';
import Image from 'next/image';
import emptyIcon from "../../_assests/emptyIcon.svg"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import IntegrationModal from '../../_components/IntegrationModal';
import ApiKeyModal from '../../_components/ApiKeyModal';

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
    const baseUrl = `${apiBase()}/v1/admin/clients-task-uploads`
    const [token, setToken] = useState<string | null>(null);
    const [clients, setClients] = useState<ClientObj[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [integrationModalClient, setIntegrationModalClient] = useState<{ id: string; name: string } | null>(null);
    const [apiKeyModalClient, setApiKeyModalClient] = useState<{ id: string; name: string } | null>(null);

    const ClientComp = ({name, id}:{name: string, id: string}) => {
    return (
        <div className={`${ui.clientCard} min-h-[100px]`}>
            <div className='flex flex-row items-stretch h-[36px] border-b border-brand-200 bg-brand-50'>
                <div className='flex-1'></div>
                <p className='flex items-center pl-2 border-l border-brand-200 flex-[3] font-semibold text-base text-brand-700'>{name}</p>
            </div>
            <div className='pl-2 md:pl-4 lg:pl-6 pb-4 mt-2 md:mt-3 lg:mt-4 space-y-2'>
                <p className='cursor-pointer text-brand-500 text-base block hover:text-brand-500' onClick={()=>router.push(`/admin/clients/${id}`)}>Client History</p>
                <div className='flex flex-wrap gap-2'>
                    <button
                        type="button"
                        onClick={() => setIntegrationModalClient({ id, name })}
                        className='inline-flex items-center gap-1.5 text-sm text-[#485d3a] hover:text-[#3d4e2f] font-medium'
                    >
                        <Plug className="w-4 h-4" />
                        Integration
                    </button>
                    <button
                        type="button"
                        onClick={() => setApiKeyModalClient({ id, name })}
                        className='inline-flex items-center gap-1.5 text-sm text-[#485d3a] hover:text-[#3d4e2f] font-medium'
                    >
                        <KeyRound className="w-4 h-4" />
                        API Key
                    </button>
                </div>
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
            <>
            <div className={ui.panel}>
                <div className={ui.panelHeader}>
                    <p className='text-base md:text-xl font-semibold leading-none'>Clients</p>
                    <div className={ui.countBadge}>
                        {clients.length} {clients.length === 1 ? 'client' : 'clients'}
                    </div>
                </div>
                <div className={ui.panelToolbar}>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='text-brand-700 font-semibold text-sm sm:text-base'>{clients.length} Companies</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <Search className='absolute text-brand-400 top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                value={keyowrd}
                                onChange={(e) => handleSearch(e.target.value)}
                                type="text" 
                                className={ui.searchInput}
                                placeholder='search companies'    
                            />
                        </div>
                    </div>
                    {/* <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Clients</button> */}
                </div>
                {
                    isLoading
                    ?  <div className='flex-1 flex justify-center items-center py-12'>
                        <div className={ui.spinner}></div>
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

            {integrationModalClient != null && (
                <IntegrationModal
                    clientId={integrationModalClient.id}
                    companyName={integrationModalClient.name}
                    handleClose={() => setIntegrationModalClient(null)}
                    getClients={getClients}
                />
            )}
            {apiKeyModalClient != null && (
                <ApiKeyModal
                    clientId={apiKeyModalClient.id}
                    companyName={apiKeyModalClient.name}
                    handleClose={() => setApiKeyModalClient(null)}
                />
            )}
            </>
  );
}
