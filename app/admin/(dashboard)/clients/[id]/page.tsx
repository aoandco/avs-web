"use client";
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
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/clients-monthly-summary?clientId=${id}&startMonth=1`;

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
    <div className="overflow-auto flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col">
      <div className="flex flex-row justify-between items-center p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]">
        <p className="text-base md:text-xl font-semibold leading-none">
          Client History
        </p>
      </div>
      <p className="p-3 md:p-5 lg:p-6 text-base font-medium">
        <ArrowBigLeft
          className="inline mr-2 cursor-pointer"
          onClick={() => router.push("/admin/clients")}
        />
        Client Task Summary
      </p>
      <div className="mx-3 md:mx-5 lg:mx-6 mb-6 rounded-lg overflow-auto">
        {!isLoading ? 
        (
        <table className="bg-white w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <td className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </td>
              <td className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Received Task
              </td>
              <td className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approved Rep.
              </td>
              <td className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UnApproved Rep.
              </td>
              <td className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overdue Task
              </td>
            </tr>
          </thead>
            <tbody>
              {monthlyClientStats.map((monthStats, index) => {
                return (
                  <tr
                    className={`hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                    key={index}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {monthStats.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {monthStats.totalTasks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {monthStats.approvedReports}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {monthStats.unapprovedReports}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]"></div>
            </div>
          )}
      </div>
    </div>
  );
}
