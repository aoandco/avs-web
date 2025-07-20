"use client"
import { useMyContext } from '@/app/context/MyContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'



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
    const { setIsComplaintsModalOpen, setRecipientId, setComplaintId, setRecipientRole,setCompId } = useMyContext();
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [isLoadingComplains, setIsLoadingComplains] = useState(true);
    const [complainType, setComplainType] = useState<string>('all');
    const [complaints, setComplaints] = useState<ComplainObj[]>([]);

    const getComplaints = async (type:string) => {
        setComplainType(type);
        const endpoint = "https://bayog-production.up.railway.app/v1/admin/complaints"
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
    <div className='flex-1 overflow-auto rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col'>
        <div className='p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]'>
            <div className='flex justify-between items-center'>
                <p className='text-base md:text-xl font-semibold leading-none'>Complaints</p>
                <div className='bg-[#485d3a] text-white px-3 py-1 rounded-full text-sm font-medium'>
                    {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
                </div>
            </div>
        </div>
        <div className='flex-1 p-4 md:p-6'>
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
            <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200'>
                {isLoadingComplains ? (
                    <div className='bg-[#e3e2e2] flex-1 flex justify-center items-center min-h-[200px] md:min-h-[300px] lg:min-h-[400px]'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
                    </div> 
                ) : complaints.length > 0 ? (
                    // Complaints table
                    <div className='overflow-auto h-auto md:h-[350px]'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Complaint ID
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        User Email
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Subject
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Message
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Status
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {complaints.map((complaint, index) => (
                                    <tr 
                                        key={complaint._id} 
                                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                        }`}
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                            #{complaint.complaintID}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                            {complaint.userId?.email || 'N/A'}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate' title={complaint.subject}>
                                            {complaint.subject}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-600 max-w-md'>
                                            <div className='truncate' title={complaint.message}>
                                                {complaint.message.length > 50 
                                                    ? `${complaint.message.substring(0, 50)}...` 
                                                    : complaint.message
                                                }
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                                                {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <button 
                                                onClick={() => {
                                                    setIsComplaintsModalOpen(true);
                                                    setRecipientId(complaint.userId._id);
                                                    setComplaintId(complaint._id);
                                                    setCompId(complaint.complaintID);
                                                    setRecipientRole(complaint.role);
                                                }}
                                                className='cursor-pointer text-blue-600 hover:text-blue-900'>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Empty state
                    <div className='text-center py-12'>
                        <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                            <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                            </svg>
                        </div>
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>No complaints found</h3>
                        <p className='text-gray-500'>
                            {complainType === 'all' 
                                ? 'There are no complaints to display.' 
                                : `No ${complainType.replace('-', ' ')} complaints found.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>

  )
}
