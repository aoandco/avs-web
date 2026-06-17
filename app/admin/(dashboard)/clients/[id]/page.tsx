"use client";
import { apiBase } from "@/lib/apiBase";
import { ui } from "@/lib/uiClasses";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowBigLeft } from "lucide-react";
import axios from "axios";

interface monthlyClientStat {
  approvedReports: number;
  month: string;
  overdueTasks: number;
  totalReports: number;
  totalTasks: number;
  unapprovedReports: number;
}

export default function Page() {
  const token = sessionStorage.getItem("token");
  const router = useRouter();
  const { id } = useParams();
  const [monthlyClientStats, setMonthlyClientStats] = useState<monthlyClientStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const endpoint = `${apiBase()}/v1/admin/clients-monthly-summary?clientId=${id}&startMonth=1`;

  const getClientMonthlySummary = async () => {
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        setMonthlyClientStats([...response.data.data]);
      }
    } catch (err) {
      setMonthlyClientStats([]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClientMonthlySummary();
  }, []);

  return (
    <div className={ui.panel}>
      <div className={ui.panelHeader}>
        <p className="text-base md:text-xl font-semibold leading-none">
          Client History
        </p>
      </div>
      <p className="p-3 md:p-5 lg:p-6 text-base font-medium text-brand-700">
        <ArrowBigLeft
          className="inline mr-2 cursor-pointer"
          onClick={() => router.push("/admin/clients")}
        />
        Client Task Summary
      </p>
      <div className="mx-3 md:mx-5 lg:mx-6 mb-6 rounded-xl overflow-auto border border-brand-200 bg-white shadow-sm">
        {!isLoading ? 
        (
        <table className={ui.table}>
          <thead>
            <tr>
              <th>
                Month
              </th>
              <th>
                Received Task
              </th>
              <th>
                Approved Rep.
              </th>
              <th>
                UnApproved Rep.
              </th>
              <th>
                Overdue Task
              </th>
            </tr>
          </thead>
            <tbody>
              {monthlyClientStats.map((monthStats, index) => {
                return (
                  <tr
                    key={index}
                  >
                    <td className="whitespace-nowrap font-medium">
                      {monthStats.month}
                    </td>
                    <td className="whitespace-nowrap">
                      {monthStats.totalTasks}
                    </td>
                    <td className="whitespace-nowrap">
                      {monthStats.approvedReports}
                    </td>
                    <td className="whitespace-nowrap">
                      {monthStats.unapprovedReports}
                    </td>
                    <td className="whitespace-nowrap">
                      {monthStats.overdueTasks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
        </table>
        ) 
        : (
            <div className="flex-1 min-h-[400px] w-full flex justify-center items-center">
              <div className={ui.spinner}></div>
            </div>
          )}
      </div>
    </div>
  );
}
