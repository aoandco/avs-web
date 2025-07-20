"use client"
import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Image from 'next/image';
import emptyIcon from "../../_assests/emptyIcon.svg"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useMyContext } from '@/app/context/MyContext';

interface feedbackObj{
        addressExistence: string, 
        addressResidential: string,
        areaProfile : string,
        buildingColor: string,
        buildingType: string,
        comments : string,
        customerKnown: string,
        customerRelationshipWithAddress: string,
        customerResident: string,
        easeOfLocation: string,
        geoMapping: {
            lat: number,
            lng: number
        },
        geotaggedImages: string[],
        landMark: string,
        metWith: string,
        nameOfPersonMet: string,
        personMetOthers: string,
        receivedDate: string,
        recordedAudio: string,
        recordedVideo: string,
        relatioshipWithCustomer: string,
        reportUrl: string,
        visitFeedback: string
}


interface taskObj{
    feedback: feedbackObj;
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
    const {setIsTaskModalOpen, setTaskId, setActivityId, setIsDeleteTaskModalOpen, isTaskAssigned, setIsTaskAssigned, isTaskDeleted,setIsTaskDeleted, setIsViewReportModalOpen, setReportData} = useMyContext();
    const endpoint = "https://bayog-production.up.railway.app/v1/admin/tasks"
    const [token, setToken] = useState<string | null>(null);
    const [isTaskLoading, setIsTaskLoading] = useState(true);
    const [tasks, setTasks] = useState<taskObj[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const getTasks = async (filter: string) =>{
        setStatusFilter(filter)
        try{
            const response = await axios.get(`${filter === "all" ? endpoint : `${endpoint}?statusFilter=${filter}`}`, {
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
            setIsTaskLoading(false);
        }
    }

    const handleFilter = (filter: string) => {
        setIsTaskLoading(true);
        getTasks(filter);
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'assigned':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const handleViewReport = (task: taskObj) => {
        if (task.feedback) {
            console.log(task.feedback)
            setReportData(task.feedback);
            setIsViewReportModalOpen(true);
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
            getTasks('all');
            setIsTaskAssigned(false)
            setIsTaskDeleted(false)

        }
    }, [token, isTaskAssigned, isTaskDeleted]);

    return (
        <>
            <div className='h-full overflow-auto flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
                {/* <div className='flex flex-row gap-4 px-3 md:px-5 lg:px-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Companies</p>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Employees</p>
                </div>   */}
                <div className='flex flex-row justify-between items-center p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                        <p className='text-base md:text-xl font-semibold leading-none'>Tasks</p>
                        <div className='bg-[#485d3a] text-white px-3 py-1 rounded-full text-sm font-medium'>
                        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                    </div>
                <div className='p-3 md:p-5 lg:px-6 lg:py-3 flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-center border-b-[1.5px] border-b-[#b3b3b3]'>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='text-black font-semibold text-sm sm:text-base'>{tasks.length} tasks</p>
                        <div className='relative h-auto flex-1 md:w-[250px]'>
                            <IoSearch className='absolute text-[#8a8a8a] top-[50%] -translate-y-[50%] left-2' />
                            <input 
                                type="text" 
                                className='w-full border-0 border-white rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2'
                                placeholder='search  tasks'    
                            />
                        </div>
                    </div>
                    {/* <button className='bg-[#9dc782] text-white text-base rounded-lg py-2 px-4'>Add New Tasks</button> */}
                </div>
                <div className='overflow-x-auto flex flex-row gap-4 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl'>
                    <p className='self-start md:self-center text-base font-semibold'>Filter by:</p>
                    <ul className='flex flex-row gap-4 items-center list-none'>
                        <li 
                            onClick={() => handleFilter('all')}
                            className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${statusFilter === 'all' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >All
                        </li>
                        <li 
                            onClick={() => handleFilter('assigned')}
                            className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${statusFilter === 'assigned' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >Assigned
                        </li>
                        <li 
                            onClick={() => handleFilter('pending')}
                            className={`cursor-pointer text-base whitespace-nowrap px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${statusFilter === 'pending' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >Pending
                        </li>
                        <li 
                            onClick={() => handleFilter('in-progress')}
                            className={`cursor-pointer text-base whitespace-nowrap px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${statusFilter === 'in-progress' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >In Progress
                        </li>
                        <li 
                            onClick={() => handleFilter('completed')}
                            className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${statusFilter === 'completed' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                        >Completed
                        </li>
                        <li
                            onClick={() => handleFilter('over-due')}
                            className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${statusFilter === 'over-due' ? 'bg-[#485d3a] text-white' : 'bg-[#e3e2e2] text-[#0f170a]'}`}
                            >
                            Overdue
                        </li>
                    </ul>
                </div>
                {
                    isTaskLoading
                    ? <div className='flex-1 flex justify-center items-center'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                    </div>   
                    : tasks.length > 0
                    ?
                    <div className='mb-4 mx-4 lg:mx-6 m-3 md:m-5 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200'>
                        <div className='overflow-auto h-[350px]'>
                            <table className='w-full'>
                                <thead className='bg-gray-50 border-b border-gray-200'>
                                    <tr>
                                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Activity ID
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Company Name
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Verification Address2
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Customer Name
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Date Created
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {tasks.map((task: taskObj, index) => (
                                        <tr 
                                            key={task._id} 
                                            className={`hover:bg-gray-50 transition-colors duration-200 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                            }`}
                                        >
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                                #{task.activityId}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                                {task.clientId?.companyName || 'N/A'}
                                            </td>
                                            <td className='px-6 py-4 text-sm text-gray-900 max-w-xs'>
                                                <div className='truncate' title={task.verificationAddress}>
                                                    {task.verificationAddress.length > 40 
                                                        ? `${task.verificationAddress.substring(0, 40)}...` 
                                                        : task.verificationAddress
                                                    }
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                                {task.customerName || 'N/A'}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {formatDate(task.createdAt)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                <div className='flex space-x-2 items-center'>
                                                    {
                                                        task.status == 'completed' &&
                                                        <button 
                                                            onClick={() => handleViewReport(task)}
                                                            className='cursor-pointer text-blue-600 hover:text-blue-900 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-blue-50 border border-blue-200 hover:border-blue-300'
                                                        >
                                                            View Report
                                                        </button>
                                                    }
                                                    {task.status === 'pending' && (
                                                        <button 
                                                            onClick={() => { 
                                                                setIsTaskModalOpen(true); 
                                                                setTaskId(task._id);
                                                                setActivityId(task.activityId);
                                                            }}
                                                            className='text-green-600 hover:text-green-900 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-green-50 border border-green-200 hover:border-green-300'
                                                        >
                                                            Assign
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={()=>{
                                                            setTaskId(task._id)
                                                            setIsDeleteTaskModalOpen(true)
                                                        }}
                                                        className='text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-md hover:bg-red-50 border border-red-200 hover:border-red-300'
                                                       title="Delete task"
                                                    >
                                                        <MdDelete className='w-4 h-4' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <div className='flex-1 flex justify-center items-center'>
                        <div>
                            <Image src={emptyIcon} alt="no tasks icon" className='w-[150px] block mb-2 mx-auto' />
                            <p className='text-xl font-semibold mb-2 text-center'>No tasks</p>
                            <p className='text-[#8a8a8a] text-base text-center'>Expect to see your tasks here</p>
                        </div>
                    </div>
                }
            </div>
        </>
  )
}

export default Page
