"use client"
import React from 'react'
import { IoSearch } from "react-icons/io5";
import { MdUpload } from "react-icons/md";
import Image from 'next/image';
import recentIcon from "../../admin/_assests/recent-icon.svg"
import uploadIcon from "../../admin/_assests/upload-icon.svg"
import { toast, Toaster } from 'react-hot-toast';
import{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from "chart.js"
import { Line } from "react-chartjs-2"
import type { ChartData, ChartOptions} from "chart.js"
import axios from 'axios';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
)

export default function Page() {
    const [isEmpty,] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const [fileError, setFileError] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const onSubmit = async () => {
        const endpoint = 'https://bayog-production.up.railway.app/v1/client/upload-tasks'
        const files = fileInputRef.current?.files
        if (!files || files.length === 0) return
        
        setIsUploading(true)
        
        try {
            const formData = new FormData()
            formData.append('file', files[0])
            
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            if(response.status === 200) {
                toast.success("File uploaded successfully")
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error("An error occurred during upload.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const validateExcelFile = (files: FileList) => {
        if (!files || files.length === 0) {
            return "Please select a file"
        }
        
        const file = files[0]
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv' // .csv
        ]
        
        if (!validTypes.includes(file.type)) {
            return "Please select a valid Excel file (.xlsx, .xls, or .csv)"
        }
        
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            return "File size must be less than 10MB"
        }
        
        return true
    }

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const data: ChartData<'line'> = {
        labels: labels.slice(0,5),
        datasets: [{
            label: "Total Request",
            data: [4100,4100,3950,3950,3600],
            backgroundColor: '#1877f2',
            borderColor: '#1877f2'
        },
        {
            label: "Total Pending",
            data: [100,1000,800,800,1200],
            backgroundColor: "#ff0000",
            borderColor: "#ff0000"
        }
        ,
        {
          label: "Total Verified",
          data: [3900,3900,3500,3500,3000],
          backgroundColor: "#178a51",
          borderColor: "#178a51"  
        }
    ]
    }

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                display:false,
                position: "top"
            },
            title: {
                display: false,
                text: 'Chart.js Line Chart'
            }
        },
        scales:{
            y: {
            min: 0,        
            max: 5000,      
            ticks: {
                stepSize: 1000 
                }
            }
        }
    }

    const Card = ({number,desc,color}:{number: number, desc: string,color:string})=>{
        return (
            <div className={`min-h-[100px] sm:min-h-[125px] rounded-xl flex-1 flex flex-col justify-center items-center border-[1.5px] border-[#485d3a] ${color}`}>
                <p className='text-xl sm:text-2xl font-semibold'>{number}</p>
                <p className='text-sm sm:text-base font-semibold'>{desc}</p>
            </div>
        )
    }

  return (  
        <div>
            <Toaster />
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls,.csv"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const files = e.target.files
                        if (files && files.length > 0) {
                            const validation = validateExcelFile(files)
                            if (validation === true) {
                                setFileError(null)
                                onSubmit()
                            } else {
                                setFileError(validation)
                            }
                        }
                    }}
                />
                
                <div className='mb-4 md:mb-6 lg:mb-8 relative h-auto'>
                    <IoSearch className='text-xl text-[#8a8a8a] absolute top-[50%] -translate-y-[50%] left-8' />
                    <input 
                        type="text" 
                        placeholder='Search by address, reference number' 
                        className='w-full pl-16 py-3 pr-2 bg-white rounded-2xl outline-none'
                    />
                </div>
                <div className='flex flex-col sm:flex-row justify-between gap-5 md:gap-6 lg:gap-8'>
                    <div className='flex flex-col gap-4 w-full sm:w-[200px] md:w-[250px] lg:w-[300px]'>
                        <div 
                            onClick={handleUploadClick}
                            className={`bg-[#485d3a] rounded-lg py-3 lg:py-5 flex flex-row gap-3 justify-center items-center text-white transition-all duration-300 ease-linear cursor-pointer ${
                                isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 active:opacity-80'
                            }`}
                        >
                            {isUploading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <MdUpload className='text-2xl sm:text-3xl'/>
                            )}
                            <div>
                                <p className='text-sm sm:text-base font-semibold'>
                                    {isUploading ? 'Uploading...' : 'Upload Addresses'}
                                </p>
                                <p className='text-sm font-normal'>Excel file</p>
                            </div>
                        </div>
                        
                        {/* Display file validation errors */}
                        {fileError && (
                            <div className='text-red-500 text-sm px-2'>
                                {fileError}
                            </div>
                        )}
                        
                        <div className='cursor-pointer bg-white rounded-lg py-3 lg:py-5  flex flex-row gap-3 justify-center items-center border-[1.5px] border-[#485d3a] text-[#485d3a]'>
                            <p className='text-sm sm:text-base font-semibold'>Upload History</p>
                        </div>
                    </div>
                    <div className='flex-1 flex flow-row gap-3 md:gap-4 lg:gap-6'>
                    <Card
                        number={50}
                        desc={"Files pending"}
                        color={"text-[#ff0000]"}
                    />
                    <Card
                        number={27}
                        desc={"Files verified"}
                        color={"text-[#178a51]"} 
                    />
                    <Card
                        number={2}
                        desc={"Complains"}
                        color={"text-[#ff0000]"}
                    />
                    </div>
                </div>
                {
                    !isEmpty
                    ?
                    <>
                    <div className='min-h-[200px] md:min-h-[300px] lg:min-h-[350px] bg-white rounded-lg pb-6 mb-4 md:mb-6 lg:mb-8'>
                        <div className="border-b-2 border-b-[#131313] py-4 px-6 flex flex-row justify-between items-center">
                            <div className='flex flex-row gap-2 items-center'>
                                <Image className='w-[24px] sm:w-[28px] h-[24px] sm:h-[28px]' src={recentIcon} alt='recent icon' />
                                <p >Recent Uploads</p>
                            </div>
                            <p>View all</p>
                        </div>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b border-b-[#c4c4c4]'>
                                    <th className='text-sm sm:text-base text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]'>No</th>
                                    <th className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center'>File Name</th>
                                    <th className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center'>Date & Time</th>
                                    <th className='text-sm sm:text-base text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='border-b border-b-[#c4c4c4]'>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6'>01</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#178a51]'>Verified</td>
                                </tr>
                                <tr className='border-b border-b-[#c4c4c4]'>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6'>02</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#178a51]'>Verified</td>
                                </tr>
                                <tr className='border-b border-b-[#c4c4c4]'>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6'>03</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#ff0000]'>In Progress</td>
                                </tr>
                                <tr className='border-b border-b-[#c4c4c4]'>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6'>04</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6'>ABC ltd Address verificatins.xlsx</td>
                                    <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>11st April 2025 | 12:02pm</td>
                                    <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#ff0000]'>In Progress</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='mb-3 md:mb-4 lg:mb-5 rounded-lg bg-white py-4 px-4 md:px-6 lg:px-8'>
                        <p className='text-base sm:text-xl font-semibold mb-2'>Upload History</p>
                        <select className='rounded-lg border-[1.5px] border-black py-2 px-4'>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <div className='flex flex-col sm:flex-row gap-3 lg:gap-4 md:gap-6 gap-8'>
                            <div className="py-3 md:py-4 lg:py-5 w-full">
                                <Line data={data} options={options} />
                            </div>
                            <div className="self-start sm:self-end py-4 px-6 lg:px-8 border border-[#8a8a8a] rounded-md min-w-[225px]">
                                <div className='flex flex-col gap-4 pb-3 border-b border-[#8a8a8a] mb-3'>
                                    <div className='flex flex-row justify-between items-center'>
                                        <span className='h-[20px] w-[20px] rounded-full bg-[#1877f2]'></span>
                                        <p className='text-base text-[#1877f2]'>Total Request</p>
                                    </div>
                                    <div className='flex flex-row justify-between items-center'>
                                        <span className='h-[20px] w-[20px] rounded-full bg-[#ff0000]'></span>
                                        <p className='text-[#ff0000]'>Total Pending</p>
                                    </div>
                                    <div className='flex flex-row justify-between items-center'>
                                        <span className='h-[20px] w-[20px] rounded-full bg-[#178a51]'></span>
                                        <p className='text-[#178a51]'>Total Verified</p>
                                    </div>    
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <p className='text-xl font-semibold'>Current Statistics</p>
                                    <p className='text-base'>Total Request: 4590</p>
                                    <p className='text-base'>Total Verified: 3925</p>
                                    <p className='text-base'>Total pending: 1720</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                    :
                    <div className='flex flex-col h-[200px] md:min-h-[300px] lg:min-h-[350px] bg-white rounded-lg pb-6'>
                        <div className="border-b-2 border-b-[#131313] py-4 px-6 flex flex-row justify-between items-center">
                            <div className='flex flex-row gap-2 items-center'>
                                <Image src={recentIcon} alt='recent icon' />
                                <p>Recent Uploads</p>
                            </div>
                            <p>View all</p>
                        </div>
                        <div className='flex-1 flex justify-center items-center'>
                            <div className='w-[90%] max-w-[300px] flex flex-col gap-2 items-center'>
                                <Image src={uploadIcon} alt='upload icon' />
                                <p className='text-base md:text-xl font-semibold'>No Uploads yet</p>
                                <p className='text-center text-sm md:text-base'>Expect to see your recent uploads appear here soon</p>
                                <button className='cursor-pointer hover:opacity-80 active:opacity rounded-lg text-base text-white md:text-xl py-2 px-6 md:px-8 bg-[#484545]'>Upload</button>
                            </div>
                        </div>
                    </div>
                }
        </div>
  )
}
