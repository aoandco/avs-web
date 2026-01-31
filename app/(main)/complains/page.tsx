"use client"
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import emptyIcon from "../../admin/_assests/emptyIcon.svg"
import Image from 'next/image';
import axios from 'axios'
import {useForm, SubmitHandler} from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ComplainType {
    title: string;
    desc: string;
    date: string;
    time: string;
    status: string;
    id: string;
} 

interface ComplainObjType {
    _id: string;
    complaintID : string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

interface ComplainFormInput {
    title: string;
    desc: string;
}

export default function Page() {
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}, setValue} = useForm<ComplainFormInput>({
        defaultValues: {
            title: '',
            desc: ''
        }
    });
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/client/submit-complaint`
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/client/complaints`
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [complains, setComplains] = useState<ComplainObjType[]>([]);
    const [isLoadingComplains, setIsLoadingComplains] = useState(true);
    const [loadMore, setLoadMore] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [complainType, setComplainType] = useState('all');

    
    const handleSearch = async (value : string) => {
        setKeyword(value)
        const endpoint = `${baseUrl}?search=${value}`
        try{
            const response = await axios.get(endpoint,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 200){
                setComplains(response.data.data)
            }
        }catch(err){
            setComplains([])
            console.error("Error searching clients:", err);
        }
    }


    const getStatusColor = (status: string) => {
        switch(status) {
            case 'opened':
                return 'bg-[#c837ab]';
            case 'in-review':
                return 'bg-[#1877f2]';
            case 'resolved':
                return 'bg-[#178a51]';
            default:
                return 'bg-[#8a8a8a]';
        }
    }
    const onSubmit: SubmitHandler<ComplainFormInput> = (data) => {
        setIsLoading(true);
        axios.post(endpoint, {
            subject: data.title,
            message: data.desc
        },
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then((response) => {
            toast.success(response.data.message);
            setValue("title", "");
            setValue("desc", "");
            getComplains("all")
        })
        .catch((error) => {
            toast.error(error.response ? error.response.data.message : "An error occurred while submiting....");
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }


    const Complain = ({title,desc,date,time,status,id}:  ComplainType) => {
        return (
            <div className='min-w-[400px] mb-3 md:mb-4 lg:mb-6 px-4 md:px-6 py-4 md:py-6 rounded-xl bg-white h-auto'>
                <div className='flex flex-row justify-between items-center mb-2 md:mb-3 lg:mb-4'>
                    <p className='text-base font-semibold'>{title}</p>
                    <p className={`px-4 py-2 rounded-full text-white ${getStatusColor(status)} hover:opacity-80`}>{status}</p>
                </div>
                <p className='text-[#626262] mb-2 md:mb-3 lg:mb-4'>{desc}</p>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row gap-2 font-semibold'>
                        <p>{date}</p>
                        <p>|</p>
                        <p>{time}</p>
                    </div>
                    <p className='font-semibold text-base'>{id}</p>
                </div>
            </div>

        )
    } 

    const getComplains = async (filter: string) => {
        setComplainType(filter);
        try{
            const response = await axios.get(`${filter== "all" ?baseUrl :`${baseUrl}?status=${filter}`}`, {
                headers: {  
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if(response.status === 200) {
                setComplains(response.data.data);
            }
        }catch(error){
            console.error("Error fetching notifications:", error);
            setComplains([]);
        }
        finally{
            setIsLoadingComplains(false);
        }

    }

    const handleFilter = (filter: string) => {
        setIsLoadingComplains(true);
        getComplains(filter);
    }

    useEffect(()=>{
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            router.push("/login");
        }
    },[])

    useEffect(()=>{
        if(token){
            getComplains("all")
        }
    },[token])

  return (
        <div>
            <Toaster />
                <div className='mb-4 md:mb-6 lg:mb-8 relative h-auto'>
                    <Search className='text-xl text-[#8a8a8a] absolute top-[50%] -translate-y-[50%] left-8' />
                    <input 
                        value={keyword}
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text" 
                        placeholder='Search complains' 
                        className='w-full pl-16 py-3 pr-2 bg-white rounded-2xl outline-none'
                    />
                </div>
                <div className='overflow-x-auto mb-4 md:mb-6 lg:mb-8 flex flex-row gap-4 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl'>
                    <p className='self-start md:self-center text-base font-semibold'>Filter by:</p>
                    <ul className='flex flex-row gap-4 md:gap-6 lg:gap-10 items-center list-none'>
                        <li 
                            onClick={() => handleFilter('all')}
                            className={`cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${complainType === 'all' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >All
                        </li>
                        <li 
                            onClick={() => handleFilter('opened')}
                            className={`cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${complainType === 'opened' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >Opened
                        </li>
                        <li 
                            onClick={() => handleFilter('in-review')}
                            className={`cursor-pointer text-base whitespace-nowrap px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${complainType === 'in-review' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >In review
                        </li>
                        <li 
                            onClick={() => handleFilter('resolved')}
                            className={`cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${complainType === 'resolved' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >Resolved
                        </li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className='py-3 px-4 rounded-xl bg-white'>
                    <input
                        {...register("title", { required: "Title is required" })}
                        placeholder='Title of complain' 
                        className={`${errors.title ? "border-red-500" : 'focus:border-b-[#485d3a] focus:border-b-2'} text-[#8a8a8a] text-xl text-black w-full block font-semibold mb-3 p-2 focus:outline-none`}
                    />
                    <textarea
                        {...register("desc", { required: "Description is required" })} 
                        className={`${errors.desc ? "border-2 border-red-500 rounded-lg" : "focus:border-2 focus:border-[#485d3a] rounded-lg" } p-2 w-full h-[150px] resize-y text-[#8a8a8a] focus:outline-none text-black`} 
                        name="desc" 
                        id="desc" 
                        placeholder='write your complains'
                    ></textarea>
                </div>
                <button type='submit' className='my-3 md:my-5 lg:my-7 mx-auto text-sm px-16 py-2 rounded-xl block text-white bg-[#485d3a] cursor-pointer hover:opacity-80'>
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
                </form>
                <p className='mb-2 md:mb-4 lg:mb-6 text-base font-semibold'>All Complains List</p>
                <div className='h-[450px] overflow-auto bg-[#e3e2e2] rounded-xl px-6 md:px-8 lg:px-10 py-4 md:py-6 lg:py-8 mb-4 md:mb-mb-6 lg:mb-8'>
                    {
                    isLoadingComplains
                    ? 
                    <div className='flex-1 flex justify-center items-center h-full'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                    </div>  
                    : complains.length > 0
                    ?
                    <>
                    {
                    !loadMore
                    ?
                    complains.slice(0,3).map((complain,index)=>{
                        return (
                            <Complain 
                                key={index}
                                title={complain.subject}
                                desc={complain.message}
                                date={new Date(complain.createdAt).toLocaleDateString()}
                                time={new Date(complain.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                status={complain.status}
                                id={complain.complaintID}
                            />
                        )
                    })
                    :
                    complains.map((complain,index)=>{
                        return (
                            <Complain 
                                key={index}
                                title={complain.subject}
                                desc={complain.message}
                                date={new Date(complain.createdAt).toLocaleDateString()}
                                time={new Date(complain.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                status={complain.status}
                                id={complain.complaintID}
                            />
                        )
                    })
                }
                {
                    complains.length > 3 &&
                    <button 
                        onClick={() => setLoadMore(!loadMore)}
                        className='mx-auto block text-sm py-3 px-16 md:px-20 lg:px-24 rounded-full text-white bg-[#178a51] cursor-pointer hover:opacity-80'>
                        {
                            loadMore ? "Show Less" : "Load More"
                        }
                    </button>
                }
                    </>
                    : 
                     <div className='flex-1 flex justify-center items-center h-full'>
                        <div>
                            <Image src={emptyIcon} alt="no  complains icon" className='w-[150px] block mb-2 mx-auto' />
                            <p className='text-xl font-semibold mb-2 text-center'>No complains</p>
                            <p className='text-[#8a8a8a] text-base text-center'>Expect to see your complains here</p>
                        </div>
                    </div>
                    }
                </div>
        </div>
  )
}
