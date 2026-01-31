/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import axios from 'axios';
import React, { useState } from 'react'
import toast, {Toaster} from "react-hot-toast"
import { X } from "lucide-react"

interface deleteTaskModal {
    taskIds : string[],
    handleClose: ()=>void,
    getTasks: () => void
}

export default function DeleteTaskModal({taskIds,handleClose, getTasks}: deleteTaskModal) {
    const token = sessionStorage.getItem("token")
    const [isTaskDeleting, setIsTaskDeleting] = useState(false);

    const deleteTask = async () => {
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/delete-task`
        setIsTaskDeleting(true);
        try{
            const response = await axios.post(`${endpoint}/${taskIds[0]}`, {},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 200){
                toast.success(response.data.message);
                getTasks()
                setTimeout(()=>{
                    handleClose()
                },1000)
            }
        }catch(err : any){
            toast.error(err.response ? err.response.data.message : "Error deleting task");
        }finally{
            setIsTaskDeleting(false);
        }
    }


  return (
    <div className='fixed inset-0 flex items-center justify-center w-full h-full z-10'>
        <Toaster />
      <div onClick={handleClose} className='absolute top-0 left-0 w-full h-full bg-black opacity-70'></div>
      <div className='relative z-20 bg-white rounded-lg pt-4 px-4 lg:px-6 pb-8 max-w-xl w-full'>
        <X onClick={handleClose} className='absolute top-4 right-4 cursor-pointer' />
        <h2 className='text-lg font-semibold mb-4 text-center'>Delete Task</h2>
        <p className='mb-6'>Are you sure you want to delete this task?</p>
        <div className='flex justify-end space-x-4'>
          <button onClick={handleClose} 
          className='cursor-pointer py-3 font-medium px-4 border border-black rounded-md bg-transparent hover:bg-gray-100 hover:border-gray-700 transition-all duration-200'
          >Cancel</button>
          <button
            onClick={deleteTask}
            disabled={isTaskDeleting} 
            className={`px-6 py-3 font-medium rounded-md transition-all duration-200 ${
                isTaskDeleting 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:scale-95'
            }`}
            >
                {isTaskDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
      </div>
    </div>
  )
}

