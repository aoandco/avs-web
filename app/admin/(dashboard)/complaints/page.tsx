"use client"
import { apiBase } from "@/lib/apiBase";
import { filterChipClass, ui } from "@/lib/uiClasses";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Eye, Bell } from 'lucide-react';
import ViewComplainModal from '../../_components/ViewComplainModal';
import ComplaintsModal from '../../_components/ComplaintsModal';



interface ComplainObj {
    _id: string;
    role: string;
    userId: {
        _id: string,
        email: string
    },
    complaintID: string,
    subject: string,
    message: string,
    status: string,
}


export default function Page() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [isLoadingComplains, setIsLoadingComplains] = useState(true);
    const [complainType, setComplainType] = useState<string>('all');
    const [complaints, setComplaints] = useState<ComplainObj[]>([]);
    const [complainObjInfo, setComplainObjInfo] = useState({
        subject: '',
        message: ""
    })
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isComplaintsModalOpen, setIsComplaintsModalOpen] = useState(false);
    const [complaintObj, setComplaintObj] = useState({
        _id: '',
        role: '',
        userId: {
            _id: "",
            email: ""
        },
        complaintID: "",
        subject: "",
        message: "",
        status: "",
    })

    const getComplaints = async (type:string) => {
        setComplainType(type);
        const endpoint = `${apiBase()}/v1/admin/complaints`
        try{
            const response = await axios.get(`${type === 'all' ? endpoint : `${endpoint}?status=${type}`}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 200){
                setComplaints(response.data.data);
            }
        }catch(err){
            setComplaints([]);
            console.error("Error fetching complaints:", err);
        }finally{
            setIsLoadingComplains(false);
        }
    }

    const handleViewComplain = (complaint: ComplainObj) =>{
        setIsViewModalOpen(true)
        setComplainObjInfo({
            subject: complaint.subject,
            message: complaint.message
        })
        if(complaint.status === "resolved") return
        const endpoint = `${apiBase()}/v1/admin/view-complaint/${complaint._id}`
        axios.post(endpoint,{},{
            headers: {
                Authorization : `Bearer ${token}`
            }   
        })
        .then(()=>{
            getComplaints('all');
        })
        .catch((err)=>{
            console.error(err.response ? err.response.data.message : 'error occurred')
        })
    }


    const handleFilter = (filter: string) => {
        setIsLoadingComplains(true);
        getComplaints(filter);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'in-review':
                return 'bg-yellow-100 text-yellow-800';
            case 'opened':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    const handleClose = () => {
        setIsComplaintsModalOpen(false);
        setComplaintObj({
        _id: '',
        role: '',
        userId: {
            _id: "",
            email: ""
        },
        complaintID: "",
        subject: "",
        message: "",
        status: "",
    })
    }

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            router.push('/login');
        }
    }, []);

    useEffect(() => {
        if (token) {
            getComplaints('all');
        }
    }, [token]);

  return (
    <div className={ui.panel}>
        <div className={ui.panelHeader}>
            <div className='flex justify-between items-center w-full'>
                <p className='text-base md:text-xl font-semibold leading-none'>Complaints</p>
                <div className={ui.countBadge}>
                    {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
                </div>
            </div>
        </div>
        <div className='flex-1 flex flex-col'>
           <div className={ui.filterBar}>
                    <p className='self-start md:self-center text-base font-semibold text-brand-700'>Filter by:</p>
                    <ul className='flex flex-row gap-4 md:gap-6 lg:gap-10 items-center list-none'>
                        <li 
                            onClick={() => handleFilter('all')}
                            className={filterChipClass(complainType === 'all')}
                        >All
                        </li>
                        <li 
                            onClick={() => handleFilter('opened')}
                            className={filterChipClass(complainType === 'opened')}
                        >Opened
                        </li>
                        <li 
                            onClick={() => handleFilter('in-review')}
                            className={filterChipClass(complainType === 'in-review')}
                        >In review
                        </li>
                        <li 
                            onClick={() => handleFilter('resolved')}
                            className={filterChipClass(complainType === 'resolved')}
                        >Resolved
                        </li>
                    </ul>
                </div>
            <div className={ui.tableCard}>
                {isLoadingComplains ? (
                    <div className={`${ui.loadingBox} border-0 shadow-none m-0`}>
                    <div className={ui.spinner}></div>
                    </div> 
                ) : complaints.length > 0 ? (
                    // Complaints table
                    <div className='overflow-auto'>
                        <table className={ui.table}>
                            <thead>
                                <tr>
                                    <th>
                                        Complaint ID
                                    </th>
                                    <th>
                                        User Email
                                    </th>
                                    <th>
                                        Subject
                                    </th>
                                    <th>
                                        Message
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((complaint) => (
                                    <tr 
                                        key={complaint._id}
                                    >
                                        <td className='whitespace-nowrap font-medium text-brand-700'>
                                            #{complaint.complaintID}
                                        </td>
                                        <td className='whitespace-nowrap text-brand-600'>
                                            {complaint.userId?.email || 'N/A'}
                                        </td>
                                        <td className='max-w-xs truncate font-medium text-brand-700' title={complaint.subject}>
                                            {complaint.subject}
                                        </td>
                                        <td className='text-brand-600 max-w-md'>
                                            <div className='truncate' title={complaint.message}>
                                                {complaint.message.length > 50 
                                                    ? `${complaint.message.substring(0, 50)}...` 
                                                    : complaint.message
                                                }
                                            </div>
                                        </td>
                                        <td className='whitespace-nowrap'>
                                            <span className={`${ui.badge} ${getStatusColor(complaint.status)}`}>
                                                {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className='whitespace-nowrap'>
                                            <button 
                                                onClick={()=>handleViewComplain(complaint)}
                                                className={`${ui.iconBtn} mr-2`}
                                                title="View complains"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsComplaintsModalOpen(true);
                                                    setComplaintObj({
                                                        ...complaint
                                                    })
                                                }}
                                                className={`${ui.iconBtn} text-brand-accent border-sky-200 hover:text-sky-700 hover:border-sky-300 hover:bg-sky-50`}
                                                title="Send Notification"
                                            >
                                                <Bell className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Empty state
                    <div className={ui.emptyState}>
                        <div className='mx-auto w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mb-4'>
                            <svg className='w-12 h-12 text-brand-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                            </svg>
                        </div>
                        <h3 className='text-lg font-medium text-brand-700 mb-2'>No complaints found</h3>
                        <p className='text-brand-500'>
                            {complainType === 'all' 
                                ? 'There are no complaints to display.' 
                                : `No ${complainType.replace('-', ' ')} complaints found.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
        {
            isViewModalOpen
            &&
            <ViewComplainModal
                title='Complaints Details' 
                isClose={()=> setIsViewModalOpen(false)}
                complainObjInfo={complainObjInfo}
            />
        }
        {
            isComplaintsModalOpen && 
            <ComplaintsModal
                getComplaints={()=>getComplaints('all')}
                handleClose={handleClose}
                complaint={complaintObj}
            />
        }
    </div>

  )
}
