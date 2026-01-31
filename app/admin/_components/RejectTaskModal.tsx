import axios from 'axios'
import { X } from 'lucide-react'
import React, { ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'

interface rejectModalTask{
  taskIds: string[],
  handleClose: () => void,
  getTasks : () => void
}

export default function RejectTaskModal({taskIds, handleClose,getTasks}: rejectModalTask) {
    const token = sessionStorage.getItem('token')
    const [isLoading,setIsLoading] = useState(false)
    const [comments, setComments] = useState('')
    // console.log(taskIds, comments)

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComments(e.target.value)
    }


    const rejectTask = () => {
        if(comments == "") return
        setIsLoading(true)
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reject-task/${taskIds[0]}`
        axios.post(endpoint,{
            comments
        },{
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
        ).then((res)=>{
            if(res.status === 200){
                toast.success(res.data.message)
                getTasks()
                setTimeout(()=>{
                  handleClose()
                },1000)
            }
        })
        .catch((err)=>{
            toast.error(err.response ? err.response.data.message: "error rejecting task")
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full z-10">
      <div onClick={handleClose} className="absolute top-0 left-0 w-full h-full bg-black opacity-70 transition-opacity duration-300"></div>
      <div className="relative bg-white p-8 rounded-xl shadow-2xl z-20 max-w-lg w-full border border-gray-200">
        <X onClick={handleClose} className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-700 transition-colors duration-200" />
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reject Task</h2>
        <p className="mb-6 text-center text-gray-600">Are you sure you want to reject this task?</p>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Comment</label>
          <textarea
            value={comments}
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none" rows={4} />
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={isLoading}
            className="cursor-pointer bg-red-500 text-white disabled:cursor-not-allowed disabled:opacity-50 px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={rejectTask}
          >
            {
                isLoading ? "rejecting.." : "Confirm" 
            }
          </button>
          <button
            className="cursor-pointer bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
