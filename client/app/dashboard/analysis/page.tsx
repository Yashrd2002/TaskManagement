"use client"
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify";
import WaveLoader from "@/components/WaveLoader";

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/dashboard`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err: any) {
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(data);

  const {
    totalTasks = 0,
    percentCompleted = 0,
    percentPending = 0,
    pendingStats = {},
    averageCompletionTime = 0,
    totalBalanceTime = 0,
    totalLapsedTime = 0,
    totalPendingTasks = 0,
  } = data || {};

  const chartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [percentCompleted, percentPending],
        backgroundColor: ["#B0EB0A", "#FF6347"],
        hoverBackgroundColor: ["#A1D51A", "#FF4500"],
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <WaveLoader />
        </div>
      ) : (
        <div className="p-6 bg-black min-h-screen text-white urbanist-500">
          <h1 className="text-3xl mb-6 text-[#B0EB0A] urbanist-700">
            Task Dashboard
          </h1>

          <div className="flex flex-wrap gap-4">
            <div className="bg-gradient-to-r from-[#B0EB0A] to-[#d7ff72] p-4 rounded-lg shadow-lg w-[250px] h-[250px] flex flex-col justify-center items-center">
              <h2 className="text-[24px] text-black text-center urbanist-700">
                Total Tasks
              </h2>
              <p className="text-[30px] urbanist-700 text-black">
                {totalTasks || 0}
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#f59846] to-[#ffdfb2] p-4 rounded-lg shadow-lg w-[250px] h-[250px] flex flex-col justify-center items-center">
              <h2 className="text-[24px] text-black text-center urbanist-700">
                Tasks Completed
              </h2>
              <p className="text-[30px] urbanist-700 text-black">
                {(percentCompleted || 0).toFixed(2)}%
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#5b86ff] to-[#a8d8fb] p-4 rounded-lg shadow-lg w-[250px] h-[250px] flex flex-col justify-center items-center">
              <h2 className="text-[24px] text-black text-center urbanist-700">
                Tasks Pending
              </h2>
              <p className="text-[30px] urbanist-700 text-black">
                {(percentPending || 0).toFixed(2)}%
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#dc42fe] to-[#e2a7ef] p-4 rounded-lg shadow-lg w-[250px] h-[250px] flex flex-col justify-center items-center">
              <h2 className="text-[24px] text-black text-center urbanist-700">
                Average time per completed task
              </h2>
              <p className="text-[30px] urbanist-700 text-black">
                {averageCompletionTime || 0}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl mb-2 text-[#B0EB0A] urbanist-700">
              Task Status Chart
            </h2>
            <div className="w-[300px]">
              <Pie data={chartData} />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl mb-2 text-[#B0EB0A] urbanist-700">
              Pending Task Summary
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="bg-gradient-to-r from-[#32dd38] to-[#7cff81] p-4 rounded-lg shadow-lg w-[250px] h-[250px] flex flex-col justify-center items-center">
                <h2 className="text-[24px] text-black text-center urbanist-700">
                  Pending task
                </h2>
                <p className="text-[30px] urbanist-700 text-black">
                  {totalPendingTasks || 0}
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#ffb34f] to-[#f3981a] p-4 rounded-lg shadow-lg w-[250px] h-[250px] flex flex-col justify-center items-center">
                <h2 className="text-[24px] text-black text-center urbanist-700">
                  Total time elapsed
                </h2>
                <p className="text-[30px] urbanist-700 text-black">
                  {totalLapsedTime || 0}
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#ff4457] to-[#f6142b] p-4 rounded-lg shadow-lg w-[250px] h-[250px] flex flex-col justify-center items-center">
                <h2 className="text-[24px] text-black text-center urbanist-700">
                  Total time to finish
                </h2>
                <p className="text-[30px] urbanist-700 text-black">
                  {totalBalanceTime || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl mb-2 text-[#B0EB0A] urbanist-700">
              Pending Tasks Stats
            </h2>
            <div className="bg-black p-4 rounded-lg shadow-lg overflow-x-auto">
              <table className="min-w-full table-auto text-white border-collapse">
                <thead>
                  <tr className="bg-[#B0EB0A]">
                    <th className="p-2 text-left text-black">Priority</th>
                    <th className="p-2 text-left text-black">
                      Number of Tasks
                    </th>
                    <th className="p-2 text-left text-black">
                      Lapsed Time (hours)
                    </th>
                    <th className="p-2 text-left text-black">
                      Balance Time (hours)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(pendingStats).map(
                    ([priority, stats]: any) => (
                      <tr key={priority} className="bg-gray-800">
                        <td className="p-2 whitespace-nowrap">{priority}</td>
                        <td className="p-2 whitespace-nowrap">{stats.count}</td>
                        <td className="p-2 whitespace-nowrap">
                          {stats.lapsed.toFixed(2)}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {stats.balance.toFixed(2)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
