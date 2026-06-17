"use client";
import { apiBase } from "@/lib/apiBase";
import { toggleBtnClass, ui } from "@/lib/uiClasses";
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
  incompleteTasks: number;
  verifiedTasks: number;
  approvedReports: number;
  unapprovedReports: number;
  approvedSuccessReports: number;
  approvedFailedReports: number;
  approvedReturnedReports: number;
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
  const [statsRange, setStatsRange] = useState<"month" | "history">("month");
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType>({
    totalTasks: 0,
    assignedTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    pendingTasks: 0,
    incompleteTasks: 0,
    verifiedTasks: 0,
    approvedReports: 0,
    unapprovedReports: 0,
    approvedSuccessReports: 0,
    approvedFailedReports: 0,
    approvedReturnedReports: 0,
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
        className={`${bgColor} ui-stat-card--filled ${
          type === "first" ? "px-4 py-6" : "px-6 py-4"
        } rounded-xl text-white`}
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
    setIsLoading(true);
    const endpoint =
      statsRange === "history"
        ? `${apiBase()}/v1/admin/dashboard-stats?start=history`
        : `${apiBase()}/v1/admin/dashboard-stats`;
    axios
      .get(endpoint, {
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
          incompleteTasks: 0,
          verifiedTasks: 0,
          approvedReports: 0,
          unapprovedReports: 0,
          approvedSuccessReports: 0,
          approvedFailedReports: 0,
          approvedReturnedReports: 0,
          agentCount: 0,
          taskFiles: [],
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getMonthlySummary = async () => {
    const endpoint = `${apiBase()}/v1/admin/monthly-summary-stats?year=${year}&startMonth=1`;
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
  }, [token, statsRange]);

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
    <div className={ui.panel}>
      <div className={ui.panelHeader}>
        <p className="text-base md:text-xl font-semibold leading-none">
          Dashboard
        </p>
      </div>
      <div className="flex-1">
        <div className="p-3 md:p-5 lg:p-6">
          <div className="mb-4 md:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-brand-200 bg-white px-3 py-3 md:px-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-brand-700">Stats Range</p>
              <p className="text-xs text-brand-500">
                Switch between this month and full historical metrics.
              </p>
            </div>
            <div className={ui.toggleGroup}>
              <button
                type="button"
                onClick={() => setStatsRange("month")}
                className={toggleBtnClass(statsRange === "month")}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setStatsRange("history")}
                className={toggleBtnClass(statsRange === "history")}
              >
                All History
              </button>
            </div>
          </div>
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
              paraText1="Approved Reports"
              paraText2={dashboardStats.approvedReports.toString()}
              bgColor={
                dashboardStats.approvedReports == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#15803d]"
              }
            />
            <Card
              type="first"
              paraText1="Unapproved Reports"
              paraText2={dashboardStats.unapprovedReports.toString()}
              bgColor={
                dashboardStats.unapprovedReports == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#ca8a04]"
              }
            />
            <Card
              type="first"
              paraText1="Approved Success (V2)"
              paraText2={dashboardStats.approvedSuccessReports.toString()}
              bgColor={
                dashboardStats.approvedSuccessReports == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#16a34a]"
              }
            />
            <Card
              type="first"
              paraText1="Approved Failed (V3)"
              paraText2={dashboardStats.approvedFailedReports.toString()}
              bgColor={
                dashboardStats.approvedFailedReports == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#dc2626]"
              }
            />
            <Card
              type="first"
              paraText1="Approved Returned (V4)"
              paraText2={dashboardStats.approvedReturnedReports.toString()}
              bgColor={
                dashboardStats.approvedReturnedReports == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#9333ea]"
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
              paraText1="Total Incomplete"
              paraText2={dashboardStats.incompleteTasks.toString()}
              bgColor={
                dashboardStats.incompleteTasks == 0
                  ? "bg-[#8a8a8a]"
                  : "bg-[#f97316]"
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
              className={`w-[200px] ${ui.select}`}
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
          <div className="overflow-auto mb-6 rounded-xl h-[400px] border border-brand-200 bg-white shadow-sm">
            {!isStatLoading ? (
              <table className={ui.table}>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Task</th>
                    <th>Assigned Task</th>
                    <th>Pending Requests</th>
                    <th>Incomplete Requests</th>
                    <th>TAT</th>
                    <th>OTAT</th>
                    <th>Fail Rep.</th>
                    <th>Pass Rep.</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummaryStats.map((monthStat, index) => {
                    return (
                      <tr key={index}>
                        <td className="whitespace-nowrap font-medium">
                          {monthStat.month}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.totalTasks}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.assignedTasks}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.pendingRequests}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.incompleteRequests}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.tat}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.otat}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.failReports}
                        </td>
                        <td className="whitespace-nowrap">
                          {monthStat.passReports}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex-1 h-full flex justify-center items-center">
              <div className={ui.spinner}></div>
              </div>
            )}
          </div>
          <Suspense
            fallback={
              <div className="min-h-[400px] flex justify-center items-center">
              <div className={ui.spinner}></div>
              </div>
            }
          >
            <div className={`${ui.section} min-h-[200px] md:min-h-[300px] lg:min-h-[350px] pb-6`}>
              <div className={ui.sectionHead}>
                <div className="flex flex-row gap-2 items-center text-brand-700 font-medium">
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
                  className="text-base md:text-xl hover:text-brand-500 active:text-brand-600"
                >
                  View all
                </Link>
              </div>
              {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className={`${ui.spinner} h-10 w-10`}></div>
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
                <table className={`${ui.tableSimple} min-w-[375px]`}>
                  <thead>
                    <tr>
                      <th className="text-start">No</th>
                      <th className="text-center">File Name</th>
                      <th className="text-center">Date & Time</th>
                      <th className="text-start">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats.taskFiles.slice(0, 3).map((file, index) => (
                      <tr key={file._id}>
                        <td>{index + 1}</td>
                        <td className="text-center">
                          <span>{file.taskUrl.split("/").pop()}</span>
                        </td>
                        <td className="text-center text-brand-400">
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
