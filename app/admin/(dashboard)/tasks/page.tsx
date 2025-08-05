/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Search, Trash2, User, Eye, XCircle } from "lucide-react";
import Image from "next/image";
import emptyIcon from "../../_assests/emptyIcon.svg";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import ViewReportModal from "../../_components/ViewReportModal";
import TaskModal from "../../_components/TaskModal";
import DeleteTaskModal from "../../_components/DeleteTaskModal";
import RejectTaskModal from "../../_components/RejectTaskModal";

interface GeoMappingData {
    addressExistence: string;
    addressResidential: string;
    areaProfile: string;
    buildingColor: string;
    buildingType: string;
    comments: string;
    customerKnown: string;
    customerRelationshipWithAddress: string;
    customerResident: string;
    easeOfLocation: string;
    geoMapping: {
        lat: number;
        lng: number;
    };
    geotaggedImages: string[];
    landMark: string;
    metWith: string;
    nameOfPersonMet: string;
    personMetOthers: string;
    receivedDate: string;
    recordedAudio: string;
    recordedVideo: string;
    relatioshipWithCustomer: string;
    reportUrl: string;
    visitFeedback: string;
}

interface feedbackObj {
  addressExistence: string;
  addressResidential: string;
  areaProfile: string;
  buildingColor: string;
  buildingType: string;
  comments: string;
  customerKnown: string;
  customerRelationshipWithAddress: string;
  customerResident: string;
  easeOfLocation: string;
  geoMapping: {
    lat: number;
    lng: number;
  };
  geotaggedImages: string[];
  landMark: string
  metWith: string;
  nameOfPersonMet: string;
  personMetOthers: string;
  receivedDate: string;
  recordedAudio: string;
  recordedVideo: string;
  relatioshipWithCustomer: string;
  reportUrl: string;
  visitFeedback: string;
}

interface taskObj {
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
  City: string,
  state: string
  createdAt: string;
  reportIsApproved: boolean
}

function Page() {
  const router = useRouter();
  const endpoint = "https://bayog-production.up.railway.app/v1/admin/tasks";
  const [token, setToken] = useState<string | null>(null);
  const [isTaskLoading, setIsTaskLoading] = useState(true);
  const [tasks, setTasks] = useState<taskObj[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTasks, setSelectedTasks] = useState<taskObj[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [keyword, setKeyword] = useState('')
  const [reportData, setReportData] = useState<GeoMappingData | null>(null);
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isRejectTaskModalOpen, setIsRejectTaskModalOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all")
  const [dateObj, setDateObj] = useState({
    startDate: "",
    endDate: ""
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
    const {name,value} = e.target

    setDateObj({
      ...dateObj,
      [name] : value
    })
  }


  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>{
    const endpoint = "https://bayog-production.up.railway.app/v1/admin/tasks"
    setKeyword(e.target.value)
    setIsTaskLoading(true)
    axios.get(`${endpoint}?search=${e.target.value}&statusFilter=${currentFilter}`,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
    .then((res)=>{
        if(res.status == 200){
            setTasks(res.data.data)
        }
    })
    .catch((err)=>{
        setTasks([])
        console.error(err.response ? err.response.data.message : "error while searching through task")
    }).finally(()=>{
        setIsTaskLoading(false)
    })
  }

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    setIsAllSelected(e.target.checked);
    if (isAllSelected) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks([...tasks]);
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      // Prepare data for Excel
      const excelData = selectedTasks.map((task, index) => ({
        "S/N": index + 1,
        "Task ID": task._id,
        "Activity ID": task.activityId,
        "Company Name": task.clientId?.companyName || "N/A",
        "Customer Name": task.customerName,
        "Verification Address": task.verificationAddress,
        "City": task.City,
        "State": task.state,
        "Status": task.status,
        "Date Created": task.createdAt,
        "Report URL": task.feedback?.reportUrl || "N/A",
      }));

      // Create a worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      worksheet["!cols"] = [
        { wch: 5 }, // S/N
        { wch: 20 }, // Task ID
        { wch: 15 }, // Activity ID
        { wch: 20 }, // Company Name
        { wch: 20 }, // Customer Name
        { wch: 40 }, // Verification Address
        { wch: 20 }, // city
        { wch: 20 }, // state
        { wch: 15 }, // Status
        { wch: 20 }, // Date Created
        { wch: 50 }, // Report URL
      ];

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

      // Generate the Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      link.download = `Tasks_Report_${currentDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed downloading. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApprovedReport = async () => {
    if (selectedTasks.length > 1) {
      const endpoint =
        "https://bayog-production.up.railway.app/v1/admin/approve-report";
      const selectedTasksIds = selectedTasks.map((task) => task._id);
      setIsApproving(true);
      try {
        const res = await axios.post(
          endpoint,
          {
            taskIds: selectedTasksIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          toast.success(res.data.message);
          getTasks("completed")
        }
      } catch (err: any) {
        toast.error(
          err.response ? err.response.data.message : "Failed to approve report"
        );
      } finally {
        setIsApproving(false);
      }
    }
  };

  const assignMultipleTask = () => {
    if (selectedTasks.length > 1) {
      const selectedTasksIds = selectedTasks.map((task) => task._id);
      setIsTaskModalOpen(true);
      setTaskIds([...selectedTasksIds]);
    }
  };

  const Task = ({ task, index }: { task: taskObj; index: number }) => {
    const selectTask = (task: taskObj) => {
      const foundTask = selectedTasks.find((t) => t._id === task._id);
      if (foundTask) {
        setSelectedTasks([...selectedTasks.filter((t) => t._id !== task._id)]);
        setIsAllSelected(false);
      } else {
        setSelectedTasks([...selectedTasks, task]);
      }
    };

    return (
      <tr
        key={task._id}
        className={`hover:bg-gray-50 transition-colors duration-200 ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
        }`}
      >
        <td className="flex flex-row items-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <input
            checked={
              selectedTasks.find((t) => t._id === task._id) ? true : false
            }
            onChange={() => selectTask(task)}
            type="checkbox"
            className="mr-2 size-4 accent-[#485d3a]"
          />
          #{task.activityId}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.clientId?.companyName || "N/A"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
          <div className="truncate" title={task.verificationAddress}>
            {task.verificationAddress.length > 40
              ? `${task.verificationAddress.substring(0, 40)}...`
              : task.verificationAddress}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.City || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.state || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.customerName || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              task.status
            )}`}
          >
            {task.status.charAt(0).toUpperCase() +
              task.status
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim()}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(task.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {
            task.reportIsApproved ? "Yes" : "No"
          }
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2 items-center">
            <button
              onClick={() => handleViewReport(task)}
              className="cursor-pointer text-blue-600 hover:text-blue-900 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
              title="View report"
            >
              <Eye className="w-4 h-4 inline" />
            </button>

            {task.status === "pending" && (
              <button
                onClick={() => {
                  setIsTaskModalOpen(true);
                  setTaskIds([task._id]);
                  setActivityId(task.activityId);
                }}
                title="Assign task"
                className="cursor-pointer text-green-600 hover:text-green-900 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-green-50 border border-green-200 hover:border-green-300"
              >
                <User className="w-4 h-4 inline" />
              </button>
            )}
            {/* {task.status !== "completed" && ( */}
              <button
                onClick={() => {
                  setTaskIds([task._id]);
                  setIsRejectTaskModalOpen(true);
                }}
                className="cursor-pointer text-yellow-600 hover:text-yellow-900 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-yellow-50 border border-yellow-200 hover:border-yellow-300"
                title="Reject task"
              >
                <XCircle className="w-4 h-4 inline" />
              </button>
            {/* )} */}
            <button
              onClick={() => {
                setTaskIds([task._id]);
                setIsDeleteTaskModalOpen(true);
              }}
              className="cursor-pointer text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-md hover:bg-red-50 border border-red-200 hover:border-red-300"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const getTasks = async (filter: string) => {
    setStatusFilter(filter);
    try {
      const response = await axios.get(
        `${endpoint}?statusFilter=${filter}&search=${keyword}&startDate=${dateObj.startDate}&endDate=${dateObj.endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setTasks(response.data.data);
      }
    } catch (err) {
      setTasks([]);
      console.error("Error fetching tasks:", err);
    } finally {
      setIsTaskLoading(false);
    }
  };

  const handleFilter = (filter: string) => {
    setIsTaskLoading(true);
    setCurrentFilter(filter)
    getTasks(filter);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewReport = (task: taskObj) => {
    if (task.feedback) {
      setTaskIds([task._id]);
      setReportData(task.feedback);
      setIsViewReportModalOpen(true);
    }
  };

  const handleViewReportModalClose = () => {
    setIsViewReportModalOpen(false);
    setReportData(null);
    setTaskIds([]);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setTaskIds([]);
  }

  const handleDeleteModalClose = () => {
    setIsDeleteTaskModalOpen(false);
    setTaskIds([]);
  }
  const handleRejectModalClose = () => {
    setIsRejectTaskModalOpen(false)
    setTaskIds([])
  }


  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (token) {
      if(!isTaskLoading){
        setIsTaskLoading(true);
      }
      getTasks("all");
    }
  }, [token, dateObj.startDate, dateObj.endDate]);

  return (
    <>
      <Toaster />
      <div className="h-full overflow-auto flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col">
        {/* <div className='flex flex-row gap-4 px-3 md:px-5 lg:px-6 border-b-[1.5px] border-b-[#b3b3b3]'>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Companies</p>
                    <p className='py-3 md:py-5 lg:py-6 text-sm md:text-base leading-none text-[#8a8a8a] hover:text-[#9dc782] hover:border-b hover:border-b-[#9dc782] cursor-pointer'>Employees</p>
                </div>   */}
        <div className="flex flex-row justify-between items-center p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]">
          <p className="text-base md:text-xl font-semibold leading-none">
            Tasks
          </p>
          <div className="bg-[#485d3a] text-white px-3 py-1 rounded-full text-sm font-medium">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
        </div>
        <div className="p-3 md:p-5 lg:px-6 lg:py-3 flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-center border-b-[1.5px] border-b-[#b3b3b3]">
          <div className="flex flex-row gap-4 items-center">
            <p className="text-black font-semibold text-sm sm:text-base">
              {tasks.length} tasks
            </p>
            <div className="relative h-auto flex-1 md:w-[250px] lg:w-[350px]">
              <Search className="absolute text-[#8a8a8a] top-[50%] -translate-y-[50%] left-2" />
              <input
                value={keyword}
                onChange={handleSearch}
                type="text"
                className="text-black w-full border-0 border-white rounded-xl border-[1.5px] bg-white text-[#8a8a8a] py-2 pl-8 pr-2"
                placeholder="actvity id, address and company"
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-1">
              <span>Start Date</span>
              <input 
                type="date"
                name="startDate"
                value={dateObj.startDate}
                onChange={handleChange}
                className="p-2 border border-[#b3b3b3] rounded-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span>End Date</span>
              <input 
                type="date"
                name="endDate"
                value={dateObj.endDate}
                onChange={handleChange}
                className="p-2 border border-[#b3b3b3] rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto flex flex-row gap-4 lg:gap-10 items-center px-4 lg:px-6 py-3 bg-white rounded-xl">
          <p className="self-start md:self-center text-base font-semibold">
            Filter by:
          </p>
          <ul className="flex flex-row gap-4 items-center list-none">
            <li
              onClick={() => handleFilter("all")}
              className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${
                statusFilter === "all"
                  ? "bg-[#485d3a] text-white"
                  : "bg-[#e3e2e2] text-[#0f170a]"
              }`}
            >
              All
            </li>
            <li
              onClick={() => handleFilter("assigned")}
              className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${
                statusFilter === "assigned"
                  ? "bg-[#485d3a] text-white"
                  : "bg-[#e3e2e2] text-[#0f170a]"
              }`}
            >
              Assigned
            </li>
            <li
              onClick={() => handleFilter("pending")}
              className={`cursor-pointer text-base whitespace-nowrap px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${
                statusFilter === "pending"
                  ? "bg-[#485d3a] text-white"
                  : "bg-[#e3e2e2] text-[#0f170a]"
              }`}
            >
              Pending
            </li>
            <li
              onClick={() => handleFilter("completed")}
              className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${
                statusFilter === "completed"
                  ? "bg-[#485d3a] text-white"
                  : "bg-[#e3e2e2] text-[#0f170a]"
              }`}
            >
              Completed
            </li>
            <li
              onClick={() => handleFilter("over-due")}
              className={`cursor-pointer text-base px-4 py-2 rounded-xl hover:bg-[#485d3a] hover:text-white ${
                statusFilter === "over-due"
                  ? "bg-[#485d3a] text-white"
                  : "bg-[#e3e2e2] text-[#0f170a]"
              }`}
            >
              Overdue
            </li>
          </ul>
        </div>
        {isTaskLoading ? (
          <div className="flex-1 flex justify-center items-center mb-4 mx-4 lg:mx-6 m-3 md:m-5 border rounded-xl border-gray-200 bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="flex-1 mb-4 mx-4 lg:mx-6 m-3 md:m-5 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {selectedTasks.length > 1 && (
              <div className="flex flex-row justify-end gap-4 p-2">
                <button
                  //   onClick={}
                  onClick={assignMultipleTask}
                  className="cursor-pointer text-white bg-green-600 hover:bg-green-900 transition-colors duration-200 px-3 py-2 rounded-md"
                >
                  Assign Task
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="cursor-pointer text-white bg-blue-600 hover:bg-blue-900 transition-colors duration-200 px-3 py-2 rounded-md"
                  disabled={isDownloading || selectedTasks.length === 0}
                >
                  {isDownloading ? "Downloading..." : "Download"}
                </button>
                <button
                  onClick={handleApprovedReport}
                  className="cursor-pointer text-white bg-purple-600 hover:bg-purple-900 transition-colors duration-200 px-3 py-2 rounded-md"
                >
                  {isApproving ? "Approving..." : "Approve"}
                </button>
              </div>
            )}
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        type="checkbox"
                        className="mr-2 size-4 translate-y-1 accent-[#485d3a]"
                      />
                      Activity ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Approved
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task: taskObj, index) => {
                    return <Task key={task._id} task={task} index={index} />;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div>
              <Image
                src={emptyIcon}
                alt="no tasks icon"
                className="w-[150px] block mb-2 mx-auto"
              />
              <p className="text-xl font-semibold mb-2 text-center">No tasks</p>
              <p className="text-[#8a8a8a] text-base text-center">
                Expect to see your tasks here
              </p>
            </div>
          </div>
        )}
        {
          isViewReportModalOpen &&
          <ViewReportModal
            handleClose={handleViewReportModalClose}
            getTasks={() =>getTasks("all")}
            reportData={reportData}
            taskIds={taskIds}
            />
        }
        {
          isTaskModalOpen && 
          <TaskModal 
            getTasks={() => getTasks("all")}
            taskIds={taskIds}
            handleClose={handleTaskModalClose}
            activityId={activityId}
          />
        }
        {
          isDeleteTaskModalOpen
          &&
          <DeleteTaskModal 
            getTasks={() => getTasks("all")}
            taskIds={taskIds}
            handleClose={handleDeleteModalClose}
          />
        }
        {isRejectTaskModalOpen && (
          <RejectTaskModal
            getTasks={() => getTasks("all")}
            taskIds={taskIds}
            handleClose={handleRejectModalClose}
            />
        )}

      </div>
    </>
  );
}

export default Page;
