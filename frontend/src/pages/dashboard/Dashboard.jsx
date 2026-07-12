import MainLayout from "../../components/layout/MainLayout";
import { useState, useEffect } from "react";
import { getDashboardStats } from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";
import RecentContracts from "../../components/dashboard/RecentContracts";
import QuickActions from "../../components/dashboard/QuickActions";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  const totalContracts = stats?.total_contracts ?? 0;
  const avgRisk = stats?.average_risk ?? 0;
  const highRisk = stats?.high_risk_count ?? 0;
  const totalAnalyses = stats?.total_analyses ?? 0;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-slate-400 mt-2">AI Contract & Agreement Explainer</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Contracts" value={String(totalContracts)} color="text-blue-500" />
        <StatCard title="Average Risk" value={`${avgRisk}%`} color="text-green-500" />
        <StatCard title="High Risk" value={String(highRisk)} color="text-red-500" />
        <StatCard title="Analyses" value={String(totalAnalyses)} color="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2">
          <RecentContracts contracts={stats?.recent_contracts ?? []} />
        </div>
        <QuickActions />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
