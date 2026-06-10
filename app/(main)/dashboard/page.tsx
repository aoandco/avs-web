"use client"
import { apiBase } from "@/lib/apiBase";
import React, {useEffect, useState } from 'react'
import { Upload, Download } from "lucide-react";
import Image from 'next/image';
import recentIcon from "../../admin/_assests/recent-icon.svg"
import uploadIcon from "../../admin/_assests/upload-icon.svg"
import { toast, Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
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
import { useRouter } from 'next/navigation';
import UploadFileModal from './component/UploadFileModal';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
)

interface uploadedType {
    _id: string;
    status: string;
    fileName: string;
    uploadedAt: string;
}

interface monthlyTaskType {
    month: string;
    pending: number;
    verified: number;
    total: number;
}

interface reportsObj {
    _id: string;
    activityId: string;
    customerName: string;
    verificationAddress: string;
    fullAddress?: string;
    additionalInformation?: string;
    street?: string;
    area?: string;
    city?: string;
    state: string;
    country?: string;
    landmark?: string;
    postalCode?: string;
    status?: string;
    createdAt?: string;
    reportIsApproved?: boolean;
    addressExistence: string;
    addressResidential: string;
    areaProfile: string;
    buildingColor: string;
    buildingType: string;
    comments: string;
    additionalComments?: string;
    customerKnown: string;
    customerRelationshipWithAddress: string;
    customerResident: string;
    easeOfLocation: string;
    firstGeotaggedImage: string | null;
    secondGeotaggedImage?: string | null;
    landMark: string;
    latitude: number;
    longitude: number;
    metWith: string;
    nameOfPersonMet: string;
    receivedDate: string;
    recordedAudio: string;
    recordedVideo: string;
    relatioshipWithCustomer: string;
    personMetOthers?: string;
    visitFeedback: string;
    reportUrl: string;
}

interface DashboardStatsType {
    totalPendingFiles: number;
    totalVerifiedFiles: number;
    totalComplaints: number;
    uploads: uploadedType[];
    totalRequest: number;
    totalVerified: number;
    totalPending: number;
    monthlyTasks: monthlyTaskType[];
    reports: reportsObj[];   
}
export default function Page() {
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUploadFileVisible, setIsUploadFileVisible] = React.useState(false)
    const [isDownloading, setIsDownloading] = React.useState(false)
    const [selectedReports, setSelectedReports] = React.useState<reportsObj[]>([])
    const [isAllReportsSelected, setIsAllReportsSelected] = React.useState(false)
    const [dashboardStats, setDashboardStats] = useState<DashboardStatsType>({
        totalPendingFiles: 0,
        totalVerifiedFiles: 0,
        totalComplaints: 0,
        uploads: [],
        totalRequest: 0,
        totalVerified: 0,
        totalPending: 0,
        monthlyTasks:[],
        reports: []
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'text-[#178a51]';
            case 'in-progress':
                return 'text-[#ff0000]'; 
            case 'pending':
                return 'text-[#ff8c00]'; 
            default:
                return 'text-[#8a8a8a]'; 
        }
    } 

    const getdashboardStats = async () => {
        const endpoint = `${apiBase()}/v1/client/dashboard-stats`
        try{
            const response = await axios.get(endpoint, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            if(response.status === 200) {
                setDashboardStats({
                    ...response.data.data
                })
                setSelectedReports([])
                setIsAllReportsSelected(false)
            } else {
                setDashboardStats({
                    totalPendingFiles: 0,
                    totalVerifiedFiles: 0,
                    totalComplaints: 0,
                    uploads: [],
                    totalRequest: 0,
                    totalVerified: 0,
                    totalPending: 0,
                    monthlyTasks: [],
                    reports: [] 
                })
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error)
            setDashboardStats({
                totalPendingFiles: 0,
                totalVerifiedFiles: 0,
                totalComplaints: 0,
                uploads: [],
                totalRequest: 0,
                totalVerified: 0,
                totalPending: 0,
                monthlyTasks: [],
                reports: []
            })
        } finally {
            setIsLoading(false)
        }
    } 

    const toggleReportSelection = (report: reportsObj) => {
        const isSelected = selectedReports.some((item) => item._id === report._id);
        if (isSelected) {
            setSelectedReports(selectedReports.filter((item) => item._id !== report._id));
            setIsAllReportsSelected(false);
        } else {
            setSelectedReports([...selectedReports, report]);
        }
    };

    const handleSelectAllReports = () => {
        if (isAllReportsSelected) {
            setSelectedReports([]);
            setIsAllReportsSelected(false);
            return;
        }
        setSelectedReports([...dashboardStats.reports]);
        setIsAllReportsSelected(true);
    };

    const handleDownloadReport = async () => {
        if (selectedReports.length === 0) {
            toast.error("Select at least one approved report to export");
            return;
        }

        setIsDownloading(true);
        
        try {
            const excelData = selectedReports.map((report, index) => ({
                "S/N": index + 1,
                "Task ID": report._id,
                "Activity ID": report.activityId,
                "Customer Name": report.customerName,
                "Verification Address": report.fullAddress || report.verificationAddress,
                "Additional Information": report.additionalInformation || "",
                "Street": report.street || "",
                "Area": report.area || "",
                "City": report.city || "",
                "State": report.state || "",
                "Country": report.country || "",
                "Landmark": report.landmark || "",
                "Postal Code": report.postalCode || "",
                "Status": report.status || "",
                "Report Approved": report.reportIsApproved ? "Yes" : "No",
                "Date Created": report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "",
                "Address Existence": report.addressExistence,
                "Address Residential": report.addressResidential,
                "Area Profile": report.areaProfile,
                "Building Color": report.buildingColor,
                "Building Type": report.buildingType,
                "Comments": report.comments,
                "Additional Comments": report.additionalComments || "",
                "Customer Known": report.customerKnown,
                "Customer Relationship with Address": report.customerRelationshipWithAddress,
                "Customer Resident": report.customerResident,
                "Ease of Location": report.easeOfLocation,
                "Met With": report.metWith,
                "Name of Person Met": report.nameOfPersonMet,
                "Person Met Others": report.personMetOthers || "",
                "Relationship With Customer": report.relatioshipWithCustomer,
                "Landmark (Visit)": report.landMark,
                "Visit Feedback": report.visitFeedback,
                "Received Date": report.receivedDate
                    ? new Date(report.receivedDate).toLocaleString()
                    : "",
                "Latitude": report.latitude,
                "Longitude": report.longitude,
                "First Geotagged Image": report.firstGeotaggedImage || "",
                "Second Geotagged Image": report.secondGeotaggedImage || "",
                "Recorded Audio": report.recordedAudio,
                "Recorded Video": report.recordedVideo,
                "Report URL": report.reportUrl,
            }));

            // Create a new workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            // Set column widths for better readability
            const columnWidths = [
                { wch: 5 },   // S/N
                { wch: 15 },  // Activity ID
                { wch: 20 },  // Customer Name
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 40 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 40 },  
                { wch: 15 },  
                { wch: 20 },   
            ];
            worksheet['!cols'] = columnWidths;

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

            // Generate the Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Create blob and download
            const blob = new Blob([excelBuffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Generate filename with current date
            const currentDate = new Date().toISOString().split('T')[0];
            link.download = `Approved_Reports_${currentDate}.xlsx`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
            toast.success(`Exported ${selectedReports.length} approved report(s)`);
        } catch (error) {
            console.error('Error generating Excel file:', error);
            toast.error("Failed to generate report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    }

    const chartData = React.useMemo(()=>{
        const lineData: ChartData<'line'> = {
            labels: [...dashboardStats.monthlyTasks.map(task => task.month)],
            datasets: [
            {
            label: "Total Request",
            data: [...dashboardStats.monthlyTasks.map(task => task.total)],
            backgroundColor: '#1877f2',
            borderColor: '#1877f2'
        },
            {
                label: "Total Pending",
                data: [...dashboardStats.monthlyTasks.map(task => task.pending)],
                backgroundColor: "#ff0000",
                borderColor: "#ff0000"
            },
            {
            label: "Total Verified",
            data: [...dashboardStats.monthlyTasks.map(task => task.verified)],
            backgroundColor: "#178a51",
            borderColor: "#178a51"  
            }
        ]
    }
        return lineData
    }, [dashboardStats.monthlyTasks])

    const chartOptions = React.useMemo(() => {
        const options: ChartOptions<'line'> = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
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
                    max: Math.max(...dashboardStats.monthlyTasks.map(task => task.total)) + 10,      
                }
            }
        }
        return options
    }, [dashboardStats.monthlyTasks])


    const Card = ({number,desc,color}:{number: number, desc: string,color:string})=>{
        return (
            <div className={`min-h-[100px] sm:min-h-[125px] rounded-xl flex-1 flex flex-col justify-center items-center border-[1.5px] border-[#485d3a] ${color}`}>
                <p className='text-xl sm:text-2xl font-semibold'>{number}</p>
                <p className='text-sm sm:text-base font-semibold'>{desc}</p>
            </div>
        )
    }

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
        }else{
            router.push('/login')
        }
    },[])

    useEffect(() => {
        if (token) {
            getdashboardStats()
        }
    }, [token])

  return (  
        <div>
            <Toaster />
                <div className='flex flex-col sm:flex-row justify-between gap-5 md:gap-6 lg:gap-8'>
                    <div className='flex flex-col gap-4 w-full sm:w-[200px] md:w-[250px] lg:w-[300px]'>
                        <div 
                            onClick={()=> setIsUploadFileVisible(true)}
                            className={`bg-[#485d3a] flex-1 rounded-lg py-3 lg:py-5 flex flex-row gap-3 justify-center items-center text-white transition-all duration-300 ease-linear cursor-pointer hover:opacity-80 active:opacity-80`}
                        >
                            <Upload className='text-2xl sm:text-3xl'/>
                            <div>
                                <p className='text-sm sm:text-base font-semibold'>
                                    Upload Addresses
                                </p>
                               <p className='text-sm font-normal'>Excel file</p>
                            </div>
                        </div>
                        <div 
                            onClick={handleDownloadReport}
                            className={`bg-white rounded-lg py-3 lg:py-5 flex flex-row gap-3 justify-center items-center border-[1.5px] border-[#485d3a] text-[#485d3a] transition-all duration-300 ${
                                isDownloading || selectedReports.length === 0
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'cursor-pointer hover:bg-[#485d3a] hover:text-white'
                            }`}
                        >
                            {isDownloading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#485d3a]"></div>
                            ) : (
                                <Download className='text-xl sm:text-2xl'/>
                            )}
                            <p className='text-sm sm:text-base font-semibold'>
                                {isDownloading
                                  ? 'Generating...'
                                  : `Export Selected (${selectedReports.length})`}
                            </p>
                        </div>
                    </div>
                    <div className='flex-1 flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-6'>
                    <Card
                        number={dashboardStats.totalPendingFiles}
                        desc={"Files pending"}
                        color={"text-[#ff0000]"}
                    />
                    <Card
                        number={dashboardStats.totalVerifiedFiles}
                        desc={"Files verified"}
                        color={"text-[#178a51]"} 
                    />
                    <Card
                        number={dashboardStats.totalComplaints}
                        desc={"Complains"}
                        color={"text-[#ff0000]"}
                    />
                    </div>
                </div>
                <div className='flex flex-col h-auto md:min-h-[350px] bg-white rounded-lg pb-6 my-4 md:my-6 lg:my-8'>
                    <div className="border-b-2 border-b-[#131313] py-4 px-6 flex flex-row justify-between items-center">
                        <div className='flex flex-row gap-2 items-center'>
                            <Image className='w-[24px] sm:w-[28px] h-[24px] sm:h-[28px]' src={recentIcon} alt='recent icon' />
                            <p >Recent Uploads</p>
                        </div>
                        {/* <p>View all</p> */}
                    </div>       
                {
                    isLoading 
                    ? <div className='flex justify-center items-center h-[200px] md:h-[300px] lg:h-[400px]'>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#485d3a]"></div>
                    </div>
                    : dashboardStats.uploads.length > 0
                    ?
                    <div className='overflow-x-auto'>
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
                                {
                                    dashboardStats.uploads.slice(0,4).map((upload, index) => (
                                        <tr key={upload._id} className={`${index !== 3 ? 'border-b border-b-[#c4c4c4]' : ''}`}>
                                            <td className='text-sm sm:text-base py-2 md:py-4 px-4 md:px-6'>0{index + 1}</td>
                                            <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6'>{upload.fileName}</td>
                                            <td className='text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]'>{new Date(upload.uploadedAt).toLocaleString()}</td>
                                            <td className={`text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 ${getStatusColor(upload.status)}`}>{upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                    </table>
                    </div>
                    :
                    <div className='flex-1 flex justify-center items-center'>
                            <div className='max-w-[300px] flex flex-col gap-2 items-center'>
                                <Image src={uploadIcon} alt='upload icon' />
                                <p className='text-base md:text-xl font-semibold'>No Uploads yet</p>
                                <p className='text-center text-sm md:text-base'>Expect to see your recent uploads appear here soon</p>
                                <button className='cursor-pointer hover:opacity-80 active:opacity rounded-lg text-base text-white md:text-xl py-2 px-6 md:px-8 bg-[#484545]'>Upload</button>
                            </div>
                    </div>
                }
                </div>
                <div className='mb-3 md:mb-4 lg:mb-5 rounded-lg bg-white py-4 px-4 md:px-6 lg:px-8'>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <p className='text-base sm:text-xl font-semibold'>Approved Reports</p>
                            <p className="text-sm text-[#626262]">
                                {selectedReports.length} of {dashboardStats.reports.length} selected
                            </p>
                        </div>
                        {dashboardStats.reports.length > 0 ? (
                            <div className="overflow-x-auto border border-[#e3e2e2] rounded-lg">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-b-[#c4c4c4] bg-[#fafafa]">
                                            <th className="py-3 px-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllReportsSelected}
                                                    onChange={handleSelectAllReports}
                                                    className="size-4 accent-[#485d3a]"
                                                />
                                            </th>
                                            <th className="text-sm sm:text-base py-3 px-4 text-[#626262] text-left">Activity ID</th>
                                            <th className="text-sm sm:text-base py-3 px-4 text-[#626262] text-left">Customer</th>
                                            <th className="text-sm sm:text-base py-3 px-4 text-[#626262] text-left">Address</th>
                                            <th className="text-sm sm:text-base py-3 px-4 text-[#626262] text-left">State</th>
                                            <th className="text-sm sm:text-base py-3 px-4 text-[#626262] text-left">Approved</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardStats.reports.map((report) => (
                                            <tr key={report._id} className="border-b border-b-[#e3e2e2]">
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReports.some((item) => item._id === report._id)}
                                                        onChange={() => toggleReportSelection(report)}
                                                        className="size-4 accent-[#485d3a]"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-sm">{report.activityId}</td>
                                                <td className="py-3 px-4 text-sm">{report.customerName}</td>
                                                <td className="py-3 px-4 text-sm max-w-[280px] truncate" title={report.fullAddress || report.verificationAddress}>
                                                    {report.fullAddress || report.verificationAddress}
                                                </td>
                                                <td className="py-3 px-4 text-sm">{report.state}</td>
                                                <td className="py-3 px-4 text-sm text-[#178a51]">Yes</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-[#626262]">No approved reports available yet.</p>
                        )}
                </div>
                <div className='mb-3 md:mb-4 lg:mb-5 rounded-lg bg-white py-4 px-4 md:px-6 lg:px-8'>
                        <p className='text-base sm:text-xl font-semibold mb-2'>Upload History</p>
                        <div className='flex flex-col sm:flex-row gap-3 lg:gap-4 md:gap-6 gap-8'>
                            <div className='overflow-x-auto'>
                            <div className="py-3 md:py-4 lg:py-5 w-full h-[300px] min-w-[400px]">
                                <Line data={chartData} options={chartOptions} />
                            </div>
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
                                    <p className='text-base'>Total Request: {dashboardStats.totalRequest}</p>
                                    <p className='text-base'>Total Verified: {dashboardStats.totalVerified}</p>
                                    <p className='text-base'>Total pending: {dashboardStats.totalPending}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                {
                    isUploadFileVisible
                    &&
                    <UploadFileModal
                        handleClose={()=> setIsUploadFileVisible(false)}
                        getdashboardStats={getdashboardStats}
                    />
                }    
        </div>
  )
}
