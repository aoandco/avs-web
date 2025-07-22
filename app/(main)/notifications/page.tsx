"use client"
import React, { useEffect, useState } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import emptyIcon from "../../admin/_assests/emptyIcon.svg"
import Image from 'next/image'
import axios from 'axios'  
import { useRouter } from 'next/navigation'

interface CardType {
    num: string;
    type: string;
    color: string,
    borderColor:string
}

interface NotificationsType {
    title: string;
    message: string;
    date: string;
    time: string
}

interface NotificationObjType{
    _id: string;
    recipientRole: string;
    recipientId: string;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
}



export default function Page() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const baseurl= 'https://bayog-production.up.railway.app/v1/client/notifications'
    const [notifications,setNotifications] = useState<NotificationObjType[]>([])
    const [metric,setMetric] = useState({
        message: 0,
        report: 0,
        "complaint resolution": 0
    })
    const [loading, setLoading] = useState(true)
    const [loadMore, setLoadMore] = useState(false)
    const [keyword, setKeyword] = useState("")
    const [messageType, setMessageType] = useState("")


    const Card = ({num,type,color,borderColor}:CardType)=>{
        return (
            <div className={`flex-1 border-2 ${borderColor} rounded-2xl bg-white min-h-[150px] sm:min-h-[200px] flex flex-col justify-center items-center gap-2`}>
                <p className={`${color} text-2xl sm:text-3xl font-semibold`}>{num}</p>
                <p className='text-base text-[#626262]'>{type}</p>
            </div>
        )
    }

    const Notifications = ({title,message,date,time}:NotificationsType) =>{
        return (
            <div className='min-w-[400px] mb-2 md:mb-4 bg-white rounded-xl px-6 md:px-8 lg:px-10 py-2 md:py-3 lg:py-4 flex flex-row justify-between items-center gap-4 md:gap-6 lg:gap-8'>
                <div className='flex flex-row gap-4 lg:gap-6 items-center'>
                    <MessageCircle className='shrink-0 text-2xl md:text-3xl text-black' />
                    <div>
                        <p className='text-base sm:text-xl font-semibold mb-2'>{title}</p>
                        <p className='text-sm sm:text-base text-[#626262]'>{
                            message.length > 40
                            ? `${message.substring(0,40)}...`
                            :message}
                        </p>
                    </div>
                </div>
                <div className='self-stretch flex flex-col justify-between gap-4 md:gap-6 lg:gap-10'>
                    <p className='whitespace-nowrap flex flex-row gap-2 text-sm sm:text-base font-semibold font-semibold'>
                        <span>{date}</span>
                        <span>|</span>
                        <span>{time}</span>
                    </p>
                    <button className='py-3 sm:py-4 px-2 sm:px-3 text-base font-semibold bg-white border-[1.5px] border-black rounded-lg'>Open message</button>
                </div>
            </div>
        )
    }

    const handleSearch = async (value: string) => {
        setKeyword(value)
        const endpoint = `${baseurl}?search=${value}`
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 200) {
                setNotifications([...response.data.data])
                setMetric({
                    ...response.data.counts
                })
            }
        } catch (error) {
            setNotifications([])
            setMetric({
                message: 0,
                report: 0,
                "complaint resolution": 0
            })
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const  getNotifications = async (type: string) => {
        setMessageType(type)
        try {
            const response = await axios.get(`${baseurl}?type=${type}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 200) {
                setNotifications([...response.data.data])
                setMetric({
                    ...response.data.counts
                })
            }
        }catch(error){
            setNotifications([])
            setMetric({
                message: 0,
                report: 0,
                "complaint resolution": 0
            })
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleFilter = (type: string) => {
        setLoading(true)
        getNotifications(type)
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
        if(token)
            getNotifications("")
    },[token])

  return (
        <>
            <div>
                <div className='mb-4 md:mb-6 lg:mb-8 relative h-auto'>
                    <Search className='text-xl text-[#8a8a8a] absolute top-[50%] -translate-y-[50%] left-8' />
                    <input 
                        value={keyword}
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text" 
                        placeholder='Search by address, reference number' 
                        className='w-full pl-16 py-3 pr-2 bg-white rounded-2xl outline-none'
                    />
                </div>
            </div>
            <div className='overflow-x-auto w-full mb-4 md:mb-6 lg:mb-8 flex flex-row gap-4 md:gap-8 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl'>
                <p className='self-start md:self-center text-base font-semibold'>Filter by:</p>
                <ul className='flex flex-row gap-4 md:gap-6 lg:gap-10 items-center list-none'>
                    <li 
                        onClick={() => handleFilter("")}
                        className={`cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${messageType === "" ? "bg-[#485d3a] text-white" : "bg-[#e3e2e2] text-[#0f170a]"}`}>All</li>
                    <li onClick={() => handleFilter("message")}
                        className={`cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${messageType === "message" ? "bg-[#485d3a] text-white" : "bg-[#e3e2e2] text-[#0f170a]"}`}>Messages</li>
                    <li onClick={() => handleFilter("report")}
                        className={`cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${messageType === "report" ? "bg-[#485d3a] text-white" : "bg-[#e3e2e2] text-[#0f170a]"}`}>Reports</li>
                    <li onClick={() => handleFilter("complaint resolution")}
                        className={`cursor-pointer text-base px-4 md:px-6 lg:px-8 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${messageType === "complaint resolution" ? "bg-[#485d3a] text-white" : "bg-[#e3e2e2] text-[#0f170a]"}`}>Complaints</li>
                </ul>
            </div>
            <div className='mb-4 md:mb-6 lg:mb-8 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10'>
                 
                <Card 
                    num={metric.message.toString()}
                    type={metric.message == 0 ? "No Messages" : "New Messages"}
                    color={metric.message == 0 ? "text-[#626262]" : "text-[#001eff]"}
                    borderColor={metric.message == 0 ? "border-[#626262]" : "border-[#001eff]"}
                />
                <Card 
                    num={metric.report.toString()}
                    type={metric.report == 0 ? "No Reports": "New Reports"}
                    color={metric.report == 0 ? "text-[#626262" : "text-[#178a51]"}
                    borderColor={metric.report == 0 ? 'border-[#626262]' : 'border-[#178a51]'}
                />
                <Card 
                    num={metric["complaint resolution"].toString()}
                    type={"Complaints Resolution"}
                    color={metric['complaint resolution'] == 0 ? "text-[#626262]" :"text-[#ff0000]"}
                    borderColor={metric['complaint resolution'] == 0 ? 'border-[#626262]' :'border-[#ff0000]'}
                /> 
            </div>
            <p className='mb-2 md:mb-4 lg:mb-6 text-base font-semibold'>All Notifications List</p>
            {
                loading
                ? 
                <div className='bg-[#e3e2e2] flex-1 flex justify-center items-center min-h-[200px] md:min-h-[300px] lg:min-h-[400px]'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                </div>  
                : notifications.length > 0
                ?
            <div className='bg-[#e3e2e2] rounded-xl px-6 md:px-8 lg:px-10 py-4 md:py-6 lg:py-8 mb-4 md:mb-mb-6 lg:mb-8 h-[400px] overflow-y-auto'>
                {
                    !loadMore
                    ? notifications.slice(0, 3).map((notification: NotificationObjType) => (
                        <Notifications
                            key={notification._id}
                            title={notification.title}
                            message={notification.body}
                            date={new Date(notification.createdAt).toLocaleDateString()}
                            time={new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                    ))
                    :
                    notifications.map((notification: NotificationObjType) => (
                        <Notifications
                            key={notification._id}
                            title={notification.title}
                            message={notification.body}
                            date={new Date(notification.createdAt).toLocaleDateString()}
                            time={new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                    ))
                }
                {

                }
                {
                 notifications.length > 3 &&
                    <button 
                        onClick={() => setLoadMore(!loadMore)}
                        className='mx-auto block text-sm py-3 px-16 md:px-20 lg:px-24 rounded-full text-white bg-[#178a51] cursor-pointer hover:opacity-80'>
                        {
                            loadMore ? "Show Less" : "Load More"
                        }
                    </button>                    
                }

            </div>
            : 
            <div className='bg-[#e3e2e2] rounded-xl px-6 md:px-8 lg:px-10 py-4 md:py-6 lg:py-8 mb-4 md:mb-mb-6 lg:mb-8 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex justify-center ityems-center'>
                <div className='flex-1 flex justify-center items-center'>
                    <div>
                        <Image src={emptyIcon} alt="no clients icon" className='w-[150px] block mb-2 mx-auto' />
                        <p className='text-xl font-semibold mb-2 text-center'>No Notifications at this time</p>
                        <p className='text-[#8a8a8a] text-base text-center'>Expect to see messages here soon</p>
                    </div>
                </div>    
            </div>
            }
        </>
  )
}
