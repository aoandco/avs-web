/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useMyContext } from '@/app/context/MyContext';
import axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function ComplaintsModal() {
    const token = sessionStorage.getItem("token");
    const { setIsComplaintsModalOpen, recipientId, setRecipientId, complaintId, setComplaintId, recipientRole, setRecipientRole } = useMyContext();
    const [notificationObj, setNotificationObj] = useState({ title: '', message: '', type: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNotificationObj(prev => ({ ...prev, [name]: value }));
    }


    const handleClose = () => {
        setIsComplaintsModalOpen(false);
        setRecipientId(null);
        setComplaintId(null);
        setNotificationObj({ title: '', message: '', type: "" });
        setRecipientRole(null);
    }


    const postNotification = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const endpoint = "https://bayog-production.up.railway.app/v1/admin/send-notifications"

        if(notificationObj.message === '' || notificationObj.title === '' || recipientId === null || complaintId === null)
            return;
        setLoading(true);
        try{
            const response = await axios.post(endpoint, {
            recipientId,
            title: notificationObj.title,
            body: notificationObj.message,
            complaintId,
            recipientRole : recipientRole?.toLowerCase(),
            type: notificationObj.type
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            if(response.status === 201){
                setNotificationObj({ title: '', message: '', type: "" });
                toast.success("Notification sent successfully");
            }
        } catch(err: any){
            toast.error(err.response ? err.response.data.message : "Failed to send notification");
        } finally{
            setLoading(false);
        }
    }

  return (
    <div className='fixed inset-0 flex items-center justify-center w-full h-full z-10'>
        <Toaster />
        <div 
            onClick={() => { setIsComplaintsModalOpen(false); setRecipientId(null); }}
            className='absolute top-0 left-0 w-full h-full bg-black opacity-70'
        ></div>
        <div className='relative z-20 bg-white rounded-lg pt-4 px-4 pb-8 max-w-xl w-full'>
            <h2 className='text-xl font-semibold mb-8 text-center'>Send Notifications</h2>
            <form onSubmit={postNotification} className='space-y-6'>
                <div className='pl-0 sm:pl-4 md:pl-6 flex flex-row items-center font-semibold text-base pb-2 border-b border-b-black'>
                    <p className='flex-1'>Recipient ID</p>
                    <p className='flex-[1.5] text-center'>ID {recipientId}</p>
                </div>
                <div className='pl-0 sm:pl-4 md:pl-6 flex flex-col sm:flex-row sm:items-center'>
                    <label className='flex-1 font-semibold text-base'>Title</label>
                    <input
                        type="text"
                        value={notificationObj.title}
                        onChange={handleChange}
                        name="title"
                        className='flex-[1.5] border border-black rounded-md p-2 ' placeholder='Type your Title'></input>
                </div>
                <div className='pl-0 sm:pl-4 md:pl-6 flex flex-col sm:flex-row sm:items-center'>
                    <label className='flex-1 font-semibold text-base'>Select Type</label>
                    <select
                        name='type'
                        value={notificationObj.type}
                        onChange={handleChange} 
                        className=' flex-[1.5] border border-black rounded-md p-2'>
                        <option value="">Select Type</option>
                        <option value="message">Message</option>
                        <option value="report">Report</option>
                        <option value="complaint resolution">complaint Resolution</option>
                    </select>
                </div>
                <div className='pl-0 sm:pl-4 md:pl-6 flex flex-col sm:flex-row sm:items-center'>
                    <label className='flex-1 font-semibold text-base'>Message</label>
                    <textarea
                        value={notificationObj.message}
                        onChange={handleChange}
                        name="message"
                        className='flex-[1.5] border border-black rounded-md p-2 h-[100px]' placeholder='Type your message here...'></textarea>
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-md transition-all duration-200 font-medium ${
                        loading 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-[#9dc782] text-white hover:bg-[#8cbf7a] hover:shadow-md active:scale-95'
                    }`}
                >
                    {loading ? "Sending..." : "Send Notification"}
                </button>
                <button 
                    type="button"
                    onClick={handleClose}
                    className='w-full bg-gray-300 text-black py-2 rounded-md font-medium hover:bg-gray-400 hover:shadow-sm active:scale-95 transition-all duration-200'
                >
                    Cancel
                </button>
            </form>
        </div>
    </div>
  )
}
