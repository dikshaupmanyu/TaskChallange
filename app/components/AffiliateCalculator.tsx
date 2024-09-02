import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const AffiliateCalculator: React.FC = () => {
  const [referredCustomers, setReferredCustomers] = useState(1);
  const [avgNewProjects, setAvgNewProjects] = useState(5);
  const [avgExistingProjects, setAvgExistingProjects] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referredCustomers,
        avgNewProjects,
        avgExistingProjects,
      }),
    });

    const data = await response.json();
    setMonthlyRevenue(data.monthlyRevenue.map((revenue: number, index: number) => ({
      month: getMonthLabel(index),
      revenue,
    })));
    setLoading(false);
  };

  const getMonthLabel = (index: number) => {
    const now = new Date();
    const month = new Date(now.setMonth(now.getMonth() + index)).toLocaleString('default', { month: 'short' });
    const year = now.getFullYear();
    return index === 0 || (index > 0 && now.getMonth() === 0) ? `${month} ${year}` : month;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Affiliate Revenue Calculator</h2>
      <div className="mb-4">
        <label>Referred Customers per Month</label>
        <input
          type="range"
          min="1"
          max="10"
          value={referredCustomers}
          onChange={(e) => setReferredCustomers(Number(e.target.value))}
          className="w-full"
        />
        <span>{referredCustomers}</span>
      </div>
      <div className="mb-4">
        <label>Avg. New Projects per Month</label>
        <input
          type="range"
          min="5"
          max="50"
          value={avgNewProjects}
          onChange={(e) => setAvgNewProjects(Number(e.target.value))}
          className="w-full"
        />
        <span>{avgNewProjects}</span>
      </div>
      <div className="mb-4">
        <label>Avg. Existing Projects</label>
        <input
          type="range"
          min="0"
          max="10000"
          value={avgExistingProjects}
          onChange={(e) => setAvgExistingProjects(Number(e.target.value))}
          className="w-full"
        />
        <span>{avgExistingProjects}</span>
      </div>
      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Calculate Revenue
      </button>
      {loading && <div className="mt-4">Loading...</div>}
      <div className="mt-6">
        <h3 className="text-xl font-bold">Monthly Revenue Forecast</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
};

export default AffiliateCalculator;
