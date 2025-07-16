"use client"
import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import fileIcon from "../../_assests/file-icon.png"
import Image, { StaticImageData } from 'next/image';
import emptyIcon from "../../_assests/emptyIcon.svg"
import { useRouter } from 'next/navigation';
import axios from 'axios';



interface taskObj{
    feedback: {
        geotaggedImages: string[];
    };
    _id: string;
    clientId: {
        _id: string;
        companyName: string;
        email: string;
    };
    agentId: null | string;
    activityId: string;
    customerName: string;
    verificationAddress: string;
    status: string;
    createdAt: string;
}

 function Page() {
    const router = useRouter()
    const endpoint = "https://bayog-production.up.railway.app/v1/admin/tasks"
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState<taskObj[]>([]);

    const getTasks = async () =>{
        try{
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 200){
                setTasks(response.data.data);
            }
        }catch(err){
            setTasks([]);
            console.error("Error fetching tasks:", err);
        }
        finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }else{
            router.push('/login')
        }
    }, []);

    useEffect(() => {
        if (token) {
            getTasks();
        }
    }, [token]);

    const FileComp = ({icon , file, bgColor}:{icon: StaticImageData, file: string, bgColor: string}) =>{
        return (
            <div className='h-full overflow-auto rounded-md flex flex-row gap-6 px-2 py-2 items-center bg-white'>
                <div className={`flex justify-center items-center ${bgColor} h-[36px] w-[36px] rounded-md`}>
                    <Image className="scale-80" src={icon} alt="" />
                </div>
                <p className='text-base font-semibold'>{file}</p>
            </div>
        )
    }

  return (
            <div className='h-full overflow-auto flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
                <div className='flex flex-row gap-4 px-3 md:px-5 lg:px-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Companies</p>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Employees</p>
                </div>  
                <div className='p-3 md:p-5 lg:px-6 lg:py-3 flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-center border-b-[1.5px] border-b-[#b3b3b3]'>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='text-black font-semibold text-sm sm:text-base'>46 Companies</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <IoSearch className='absolute text-[#8a8a8a] top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                type="text" 
                                className='w-full border-0 border-white rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2'
                                placeholder='search companies'    
                            />
                        </div>
                    </div>
                    <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Clients</button>
                </div>
                {
                    isLoading
                    ? <div className='flex-1 flex justify-center items-center'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                    </div>   
                    : tasks.length > 0
                    ?
                    <div className='p-3 md:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                        {
                            tasks.map((task: taskObj) => (
                                <FileComp 
                                    key={task._id}
                                    icon={fileIcon}
                                    file={task.clientId.companyName}
                                    bgColor={"bg-[#562cf1]"}
                                />
                            ))
                        }
                    </div>
                    :
                    <div className='flex-1 flex justify-center items-center'>
                        <div>
                            <Image src={emptyIcon} alt="no clients icon" className='w-[150px] block mb-2 mx-auto' />
                            <p className='text-xl font-semibold mb-2 text-center'>No tasks</p>
                            <p className='text-[#8a8a8a] text-base text-center'>Expect to see your tasks here</p>
                        </div>
                    </div>
                }
            </div>
    
  )
}

export default Page
