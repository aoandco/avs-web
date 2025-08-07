"use client";
import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface cardType {
  type: string;
  paraText1: string;
  paraText2?: string;
  children?: React.ReactNode;
  bgColor: string;
}

interface taskFileType {
  _id: string;
  taskUrl: string;
  status: string;
  uploadedAt: string;
}

interface DashboardStatsType {
  totalTasks: number;
  assignedTasks: number;
  completedTasks: number;
  overdueTasks: number;
  pendingTasks: number;
  verifiedTasks: number;
  agentCount: number;
  taskFiles: taskFileType[];
}

interface monthlyStats {
  month: string;
  year: number;
  totalTasks: number;
  assignedTasks: number;
  pendingRequests: number;
  incompleteRequests: number;
  tat: number;
  otat: number;
  passReports: number;
  failReports: number;
}

function Page() {
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType>({
    totalTasks: 0,
    assignedTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    pendingTasks: 0,
    verifiedTasks: 0,
    agentCount: 0,
    taskFiles: [],
  });
  const [year, setYear] = useState("2025");
  const [monthlySummaryStats, setMonthlySummaryStats] = useState<
    monthlyStats[]
  >([]);
  const [isStatLoading, setIsStatLoading] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-[#178a51]";
      case "in-progress":
        return "text-[#ff0000]";
      case "pending":
        return "text-[#ff8c00]";
      default:
        return "text-[#8a8a8a]";
    }
  };

  const Card = ({
    type,
    paraText1,
    paraText2,
    children,
    bgColor,
  }: cardType) => {
    return (
      <div
        className={`${bgColor} ${
          type === "first" ? "px-4 py-6" : "px-6 py-4"
        }  rounded-lg text-white`}
      >
        {type == "first" ? (
          <>
            <p className="text-end text-xl font-semibold mb-4">{paraText1}</p>
            <p className="text-end text-xl font-semibold">{paraText2}</p>
          </>
        ) : (
          <>
            <p className="text-center text-xl font-semibold mb-4">
              {paraText1}
            </p>
            {children}
          </>
        )}
      </div>
    );
  };

  const getDashboardStats = async () => {
    axios
      .get("https://bayog-production.up.railway.app/v1/admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDashboardStats({
          ...dashboardStats,
          ...response.data.data,
        });
      })
      .catch((error) => {
        console.error(
          "Error fetching dashboard stats:",
          error.response ? error.response.data.message : "An error occurred"
        );
        setDashboardStats({
          totalTasks: 0,
          assignedTasks: 0,
          completedTasks: 0,
          overdueTasks: 0,
          pendingTasks: 0,
          verifiedTasks: 0,
          agentCount: 0,
          taskFiles: [],
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getMonthlySummary = async () => {
    const endpoint = `https://bayog-production.up.railway.app/v1/admin/monthly-summary-stats?year=${year}&startMonth=1`;
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setMonthlySummaryStats([...response.data.data]);
      }
    } catch (err) {
      setMonthlySummaryStats([]);
      console.error(err)
    } finally {
      setIsStatLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getDashboardStats();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if(!isStatLoading){
        setIsStatLoading(true)
      }
      getMonthlySummary();
    }
  }, [token, year]);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  return (
    <div className="flex-1 overflow-auto rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col">
      <div className="p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]">
        <p className="text-base md:text-xl font-semibold leading-none">
          Dashboard
        </p>
      </div>
      <div className="flex-1">
        <div className="p-3 md:p-5 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6 lg:mb-10">
            <Card
              type="first"
              paraText1="Total Task"
              paraText2={dashboardStats.totalTasks.toString()}
              bgColor={
                dashboardStats.totalTasks == 0 ? "bg-[#8a8a8a]" : "bg-[#174795]"
              }
            />
            <Card
              type="first"
              paraText1="Assigned Task"
              paraText2={dashboardStats.assignedTasks.toString()}
              bgColor={
                dashboardStats.assignedTasks === 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#174795]"
              }
            />
            <Card
              type="first"
              paraText1="Total Verified"
              paraText2={dashboardStats.verifiedTasks.toString()}
              bgColor={
                dashboardStats.verifiedTasks == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#178a51]"
              }
            />
            <Card
              type="first"
              paraText1="Total Pending"
              paraText2={dashboardStats.pendingTasks.toString()}
              bgColor={
                dashboardStats.pendingTasks == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#fbbf24]"
              }
            />
            <Card
              type="first"
              paraText1="Total Overdue"
              paraText2={dashboardStats.overdueTasks.toString()}
              bgColor={
                dashboardStats.overdueTasks == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#ff0000]"
              }
            />
            <Card
              type="first"
              paraText1="Total Agent"
              paraText2={dashboardStats.agentCount.toString()}
              bgColor={
                dashboardStats.agentCount == 0 ? "bg-[#8a8a8a]" : "bg-[#2563eb]"
              }
            />
          </div>
          {/* Monthly table */}
          <div className="flex justify-end mb-4">
            <select
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-[200px] border border-[#b3b3b3] rounded-md p-2"
            >
              <option value="">-- select year --</option>
              <option value={`${new Date().getFullYear() - 1}`}>
                {new Date().getFullYear() - 1}
              </option>
              <option value={`${new Date().getFullYear()}`}>
                {new Date().getFullYear()}
              </option>
              <option value={`${new Date().getFullYear() + 1}`}>
                {new Date().getFullYear() + 1}
              </option>
            </select>
          </div>
          <div className="overflow-auto mb-6 rounded-lg h-[400px]">
            {!isStatLoading ? (
              <table className="bg-white w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Task
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Task
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending Requests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Incomplete Requests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TAT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OTAT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fail Rep.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pass Rep.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummaryStats.map((monthStat, index) => {
                    return (
                      <tr
                        className={`hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                        key={index}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {monthStat.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.totalTasks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.assignedTasks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.pendingRequests}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.incompleteRequests}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.tat}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.otat}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.failReports}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {monthStat.passReports}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex-1 h-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
              </div>
            )}
          </div>
          <Suspense
            fallback={
              <div className="min-h-[400px] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
              </div>
            }
          >
            <div className="overflow-x-auto min-h-[200px] md:min-h-[300px] lg:min-h-[350px] bg-white rounded-lg pb-6 flex flex-col">
              <div className="border-b-2 border-b-[#131313] py-4 px-6 flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src="/recent-icon.svg"
                    alt="recent icon"
                    width={16}
                    height={16}
                  />
                  <p>Recent Uploads</p>
                </div>
                <Link
                  href="/admin/tasks"
                  className="text-base md:text-xl hover:text-[#485d3a] active:text-[#485d3a]"
                >
                  View all
                </Link>
              </div>
              {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#485d3a]"></div>
                </div>
              ) : dashboardStats.taskFiles.length === 0 ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="w-[90%] max-w-[300px] flex flex-col gap-2 items-center">
                    <Image
                      src="/upload-icon.svg"
                      alt="upload icon"
                      width={24}
                      height={24}
                    />
                    <p className="text-base md:text-xl font-semibold">
                      No Uploads yet
                    </p>
                    <p className="text-center text-sm md:text-base">
                      Expect to see your recent uploads appear here soon
                    </p>
                    <button className="cursor-pointer hover:opacity-80 active:opacity rounded-lg text-base text-white md:text-xl py-2 px-6 md:px-8 bg-[#484545]">
                      Upload
                    </button>
                  </div>
                </div>
              ) : (
                <table className="w-full min-w-[375px]">
                  <thead>
                    <tr className="border-b border-b-[#c4c4c4]">
                      <th className="text-sm sm:text-base text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]">
                        No
                      </th>
                      <th className="whitespace-normal break-words text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center">
                        File Name
                      </th>
                      <th className="whitespace-normal break-words text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 text-[#626262] text-center">
                        Date & Time
                      </th>
                      <th className="whitespace-normal break-words text-sm sm:text-base text-start py-2 md:py-4 px-4 md:px-6 text-[#626262]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats.taskFiles.slice(0, 3).map((file, index) => (
                      <tr
                        key={file._id}
                        className="border-b border-b-[#c4c4c4]"
                      >
                        <td className="text-sm sm:text-base py-2 md:py-4 px-4 md:px-6">
                          {index + 1}
                        </td>
                        <td className="text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6">
                          <span>{file.taskUrl.split("/").pop()}</span>
                        </td>
                        <td className="text-sm sm:text-base text-center py-2 md:py-4 px-4 md:px-6 text-sm text-[#c4c4c4]">
                          {new Date(file.uploadedAt).toLocaleString()}
                        </td>
                        <td
                          className={`text-sm sm:text-base py-2 md:py-4 px-4 md:px-6 ${getStatusColor(
                            file.status
                          )}`}
                        >
                          {file.status.charAt(0).toUpperCase() +
                            file.status.slice(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Page;
