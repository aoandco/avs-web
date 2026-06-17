"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiBase } from "@/lib/apiBase";
import { filterChipClass, ui } from "@/lib/uiClasses";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Search, Trash2, User, Eye, XCircle, RefreshCw } from "lucide-react";
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

interface taskAddress {
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  landmark?: string;
  postalCode?: string;
  fullAddress?: string;
  additionalInformation?: string;
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
  activityId?: string | null;
  cif?: string | null;
  customerName: string;
  verificationAddress: string;
  address?: taskAddress;
  status: string;
  city: string,
  state: string
  createdAt: string;
  reportIsApproved: boolean
}

function Page() {
  const router = useRouter();
  const endpoint = `${apiBase()}/v1/admin/tasks`;
  const [token, setToken] = useState<string | null>(null);
  const [isTaskLoading, setIsTaskLoading] = useState(true);
  const [tasks, setTasks] = useState<taskObj[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [companyNameFilter, setCompanyNameFilter] = useState<string>("all");
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
  const [currentStatusFilter, setCurrentStatusFilter] = useState("all")
  const [currentApprovalFilter, setCurrentApprovalFilter] = useState("all")
  const [filterMode, setFilterMode] = useState<"status" | "approval">("status")
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [dateObj, setDateObj] = useState({
    startDate: "",
    endDate: ""
  })
  const totalPages =
    rowsPerPage === -1 ? 1 : Math.max(1, Math.ceil(tasks.length / rowsPerPage));
  const pageStart = tasks.length === 0 ? 0 : rowsPerPage === -1 ? 1 : (currentPage - 1) * rowsPerPage + 1;
  const pageEnd =
    tasks.length === 0
      ? 0
      : rowsPerPage === -1
      ? tasks.length
      : Math.min(currentPage * rowsPerPage, tasks.length);
  const paginatedTasks =
    rowsPerPage === -1
      ? tasks
      : tasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const buildTasksQuery = (
    status: string,
    approval: string,
    mode: "status" | "approval" = filterMode,
    search = keyword
  ) => {
    const params = new URLSearchParams();

    if (mode === "approval") {
      params.set("approvalFilter", approval);
    } else {
      params.set("statusFilter", status);
    }

    if (search) {
      params.set("search", search);
    }
    if (dateObj.startDate) {
      params.set("startDate", dateObj.startDate);
    }
    if (dateObj.endDate) {
      params.set("endDate", dateObj.endDate);
    }
    if (companyNameFilter !== "all") {
      params.set("companyNameFilter", companyNameFilter);
    }

    return params.toString();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
    const {name,value} = e.target

    setDateObj({
      ...dateObj,
      [name] : value
    })
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>{
    const endpoint = `${apiBase()}/v1/admin/tasks`
    setKeyword(e.target.value)
    setCurrentPage(1);
    setIsTaskLoading(true)
    axios.get(`${endpoint}?${buildTasksQuery(currentStatusFilter, currentApprovalFilter, filterMode, e.target.value)}`,{
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
      // Prepare data for Excel (fullAddress when present, else verificationAddress)
      const getDisplayAddress = (t: taskObj) =>
        t.address?.fullAddress ?? t.verificationAddress;
      const excelData = selectedTasks.map((task, index) => ({
        "S/N": index + 1,
        "Task ID": task._id,
        "Activity ID": task.activityId || "",
        "CIF": task.cif || "",
        "Company Name": task.clientId?.companyName || "N/A",
        "Customer Name": task.customerName,
        "Verification Address": getDisplayAddress(task),
        "Additional Info": task.address?.additionalInformation ?? "",
        "Street": task.address?.street ?? "",
        "Area": task.address?.area ?? "N/A",
        "City": task.address?.city ?? task.city ?? "",
        "State": task.address?.state ?? task.state ?? "",
        "Country": task.address?.country ?? "",
        "Landmark": task.address?.landmark ?? "",
        "Postal Code": task.address?.postalCode ?? "",
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
        { wch: 18 }, // CIF
        { wch: 20 }, // Company Name
        { wch: 20 }, // Customer Name
        { wch: 40 }, // Verification Address
        { wch: 30 }, // Additional Info
        { wch: 35 }, // street
        { wch: 25 }, // area
        { wch: 18 }, // city
        { wch: 18 }, // state
        { wch: 15 }, // country
        { wch: 25 }, // landmark
        { wch: 15 }, // postal code
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
    if (selectedTasks.length > 0) {
      const endpoint =
        `${apiBase()}/v1/admin/approve-report`;
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
          toast.success(res.data.data?.message || res.data.message);
          setSelectedTasks([]);
          setIsAllSelected(false);
          getTasks(currentStatusFilter, currentApprovalFilter, filterMode);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.data?.message ||
          err.response?.data?.message ||
          "Failed to approve report";
        toast.error(errorMessage);
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

  const Task = ({ task }: { task: taskObj; index: number }) => {
    const canReassignTask =
      statusFilter !== "pending" &&
      (statusFilter !== "all" || task.status !== "pending");

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
      <tr key={task._id}>
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
          <div
            className="truncate"
            title={
              [
                task.address?.fullAddress ?? task.verificationAddress,
                task.address?.additionalInformation,
              ]
                .filter(Boolean)
                .join(" — ") || task.verificationAddress
            }
          >
            {(() => {
              const fullAddress =
                task.address?.fullAddress ?? task.verificationAddress;
              const text =
                fullAddress.length > 40
                  ? `${fullAddress.substring(0, 40)}...`
                  : fullAddress;
              return text;
            })()}
          </div>
          {task.address?.additionalInformation && (
            <div className="text-xs text-gray-500 mt-0.5 truncate" title={task.address.additionalInformation}>
              {task.address.additionalInformation.length > 35
                ? `${task.address.additionalInformation.substring(0, 35)}...`
                : task.address.additionalInformation}
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          <div className="max-w-xs truncate" title={task.address?.street || "N/A"}>
            {task.address?.street || "N/A"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          <div className="max-w-xs truncate" title={task.address?.area || "N/A"}>
            {task.address?.area || "N/A"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.address?.city || task.city || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.address?.state || task.state || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.address?.country || "N/A"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600 max-w-[220px]">
          <div className="truncate" title={task.address?.landmark || "N/A"}>
            {task.address?.landmark || "N/A"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {task.address?.postalCode || "N/A"}
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
                  setActivityId(task.activityId ?? null);
                }}
                title="Assign task"
                className="cursor-pointer text-green-600 hover:text-green-900 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-green-50 border border-green-200 hover:border-green-300"
              >
                <User className="w-4 h-4 inline" />
              </button>
            )}
            {canReassignTask && (
              <button
                onClick={() => {
                  setIsTaskModalOpen(true);
                  setTaskIds([task._id]);
                  setActivityId(task.activityId ?? null);
                }}
                title="Reassign task"
                className="cursor-pointer text-indigo-600 hover:text-indigo-900 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300"
              >
                <RefreshCw className="w-4 h-4 inline" />
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

  const getTasks = async (
    status = currentStatusFilter,
    approval = currentApprovalFilter,
    mode = filterMode
  ) => {
    setStatusFilter(status);
    setApprovalFilter(approval);
    try {
      const response = await axios.get(
        `${endpoint}?${buildTasksQuery(status, approval, mode)}`,
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
      const message = axios.isAxiosError(err)
        ? err.code === "ERR_NETWORK"
          ? "Network error: could not reach the API. Try again or check that the backend is up."
          : err.response?.data?.message || err.message || "Failed to load tasks"
        : "Failed to load tasks";
      toast.error(message);
    } finally {
      setIsTaskLoading(false);
    }
  };

  const handleFilter = (filter: string) => {
    setIsTaskLoading(true);
    setFilterMode("status");
    setCurrentStatusFilter(filter);
    setCurrentApprovalFilter("all");
    setCurrentPage(1);
    getTasks(filter, "all", "status");
  };

  const handleApprovalFilter = (filter: string) => {
    setIsTaskLoading(true);
    setFilterMode("approval");
    setCurrentApprovalFilter(filter);
    setCurrentStatusFilter("all");
    setCurrentPage(1);
    getTasks("all", filter, "approval");
  };

  const handleCompanyFilter = (filter: string) => {
    setIsTaskLoading(true);
    setCompanyNameFilter(filter);
    setCurrentPage(1);
    getTasks(currentStatusFilter, currentApprovalFilter);
  };

  useEffect(() => {
    if (rowsPerPage !== -1 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [rowsPerPage, currentPage, totalPages]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "incomplete":
        return "bg-orange-100 text-orange-800";
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
      getTasks(currentStatusFilter, currentApprovalFilter);
    }
  }, [token, dateObj.startDate, dateObj.endDate, companyNameFilter]);

  const paginationSummary = (
    <p className="text-sm text-gray-600">
      Showing <span className="font-semibold">{pageStart}</span> -{" "}
      <span className="font-semibold">{pageEnd}</span> of{" "}
      <span className="font-semibold">{tasks.length}</span> tasks
    </p>
  );

  return (
    <>
      <Toaster />
      <div className={ui.panel}>
        <div className={ui.panelHeader}>
          <p className="text-base md:text-xl font-semibold leading-none">
            Tasks
          </p>
          <div className={ui.countBadge}>
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
        </div>
        <div className={ui.panelToolbar}>
          <div className="flex flex-row gap-4 items-center">
            <p className="text-brand-700 font-semibold text-sm sm:text-base">
              {tasks.length} tasks
            </p>
            <div className="relative h-auto flex-1 md:w-[250px] lg:w-[350px]">
              <Search className="absolute text-brand-400 top-[50%] -translate-y-[50%] left-2" />
              <input
                value={keyword}
                onChange={handleSearch}
                type="text"
                className={ui.searchInput}
                placeholder="actvity id, address and company"
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-brand-600">Start Date</span>
              <input 
                type="date"
                name="startDate"
                value={dateObj.startDate}
                onChange={handleChange}
                className={ui.input}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-brand-600">End Date</span>
              <input 
                type="date"
                name="endDate"
                value={dateObj.endDate}
                onChange={handleChange}
                className={ui.input}
              />
            </div>
          </div>
        </div>
        <div className={ui.filterBar}>
          <p className="self-start md:self-center text-base font-semibold text-brand-700">
            Filter by:
          </p>
          <ul className="flex flex-row gap-4 items-center list-none">
            <li
              onClick={() => handleFilter("all")}
              className={filterChipClass(statusFilter === "all")}
            >
              All
            </li>
            <li
              onClick={() => handleFilter("assigned")}
              className={filterChipClass(statusFilter === "assigned")}
            >
              Assigned
            </li>
            <li
              onClick={() => handleFilter("pending")}
              className={`${filterChipClass(statusFilter === "pending")} whitespace-nowrap`}
            >
              Pending
            </li>
            <li
              onClick={() => handleFilter("completed")}
              className={filterChipClass(statusFilter === "completed")}
            >
              Completed
            </li>
            <li
              onClick={() => handleFilter("incomplete")}
              className={filterChipClass(statusFilter === "incomplete")}
            >
              Incomplete
            </li>
            <li
              onClick={() => handleFilter("overdue")}
              className={filterChipClass(statusFilter === "overdue")}
            >
              Overdue
            </li>
          </ul>
        </div>
        <div className={`${ui.filterBar} border-t-0`}>
          <p className="self-start md:self-center text-base font-semibold whitespace-nowrap text-brand-700">
            Report approval:
          </p>
          <ul className="flex flex-row flex-wrap gap-4 items-center list-none">
            <li
              onClick={() => handleApprovalFilter("approved")}
              className={`${filterChipClass(approvalFilter === "approved")} whitespace-nowrap`}
            >
              Approved
            </li>
            <li
              onClick={() => handleApprovalFilter("unapproved")}
              className={`${filterChipClass(approvalFilter === "unapproved")} whitespace-nowrap`}
            >
              Unapproved
            </li>
            <li
              onClick={() => handleApprovalFilter("approval-success")}
              className={`${filterChipClass(approvalFilter === "approval-success")} whitespace-nowrap`}
            >
              Approved Success (V2)
            </li>
            <li
              onClick={() => handleApprovalFilter("approval-failed")}
              className={`${filterChipClass(approvalFilter === "approval-failed")} whitespace-nowrap`}
            >
              Approved Failed (V3)
            </li>
            <li
              onClick={() => handleApprovalFilter("approval-returned")}
              className={`${filterChipClass(approvalFilter === "approval-returned")} whitespace-nowrap`}
            >
              Approved Returned (V4)
            </li>
          </ul>
        </div>
        <div className={`${ui.filterBar} border-t-0`}>
          <p className="self-start md:self-center text-base font-semibold whitespace-nowrap text-brand-700">
            Company:
          </p>
          <ul className="flex flex-row gap-4 items-center list-none">
            <li
              onClick={() => handleCompanyFilter("all")}
              className={filterChipClass(companyNameFilter === "all")}
            >
              All
            </li>
            <li
              onClick={() => handleCompanyFilter("wema")}
              className={`${filterChipClass(companyNameFilter === "wema")} whitespace-nowrap`}
            >
              Wema Bank Ltd
            </li>
            <li
              onClick={() => handleCompanyFilter("others")}
              className={filterChipClass(companyNameFilter === "others")}
            >
              Others
            </li>
          </ul>
        </div>
        {isTaskLoading ? (
          <div className={ui.loadingBox}>
            <div className={ui.spinner}></div>
          </div>
        ) : tasks.length > 0 ? (
          <div className={ui.tableCard}>
            {selectedTasks.length > 0 && (
              <div className="flex flex-row justify-end gap-4 p-2">
                {selectedTasks.length > 1 && (
                  <button
                    onClick={assignMultipleTask}
                    className="cursor-pointer text-white bg-green-600 hover:bg-green-900 transition-colors duration-200 px-3 py-2 rounded-md"
                  >
                    Assign Task
                  </button>
                )}
                <button
                  onClick={handleDownloadReport}
                  className="cursor-pointer text-white bg-blue-600 hover:bg-blue-900 transition-colors duration-200 px-3 py-2 rounded-md"
                  disabled={isDownloading || selectedTasks.length === 0}
                >
                  {isDownloading ? "Downloading..." : "Download"}
                </button>
                {(statusFilter === "completed" ||
                  statusFilter === "incomplete" ||
                  approvalFilter === "unapproved") && (
                  <button
                    onClick={handleApprovedReport}
                    disabled={isApproving}
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 text-white bg-purple-600 hover:bg-purple-900 transition-colors duration-200 px-3 py-2 rounded-md"
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>
                )}
              </div>
            )}
            <div className={ui.tableMeta}>
              {paginationSummary}
            </div>
            <div className={ui.tableScroll}>
              <table className={ui.table}>
                <thead>
                  <tr>
                    <th>
                      <input
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        type="checkbox"
                        className="mr-2 size-4 translate-y-1 accent-brand-500"
                      />
                      Activity ID
                    </th>
                    <th>Company Name</th>
                    <th>Verification Address</th>
                    <th>Street</th>
                    <th>Area</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Country</th>
                    <th>Landmark</th>
                    <th>Postal Code</th>
                    <th>Customer Name</th>
                    <th>Status</th>
                    <th>Date Created</th>
                    <th>Report Approved</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task: taskObj, index) => {
                    return <Task key={task._id} task={task} index={index} />;
                  })}
                </tbody>
              </table>
            </div>
            <div className={ui.tableFooter}>
              {paginationSummary}
              <div className="flex items-center gap-3">
                <label className="text-sm text-brand-600">
                  Rows:
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setRowsPerPage(value);
                      setCurrentPage(1);
                    }}
                    className={`ml-2 ${ui.select}`}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={-1}>All</option>
                  </select>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || rowsPerPage === -1}
                    className={ui.paginationBtn}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-brand-700">
                    Page {rowsPerPage === -1 ? 1 : currentPage} of {rowsPerPage === -1 ? 1 : totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages || rowsPerPage === -1}
                    className={ui.paginationBtn}
                  >
                    Next
                  </button>
                </div>
              </div>
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
            getTasks={() =>getTasks(currentStatusFilter, currentApprovalFilter, filterMode)}
            reportData={reportData}
            taskIds={taskIds}
            />
        }
        {
          isTaskModalOpen && 
          <TaskModal 
            getTasks={() => getTasks(currentStatusFilter, currentApprovalFilter, filterMode)}
            taskIds={taskIds}
            handleClose={handleTaskModalClose}
            activityId={activityId}
          />
        }
        {
          isDeleteTaskModalOpen
          &&
          <DeleteTaskModal 
            getTasks={() => getTasks(currentStatusFilter, currentApprovalFilter, filterMode)}
            taskIds={taskIds}
            handleClose={handleDeleteModalClose}
          />
        }
        {isRejectTaskModalOpen && (
          <RejectTaskModal
            getTasks={() => getTasks(currentStatusFilter, currentApprovalFilter, filterMode)}
            taskIds={taskIds}
            handleClose={handleRejectModalClose}
            />
        )}
      </div>
    </>
  );
}

export default Page;
