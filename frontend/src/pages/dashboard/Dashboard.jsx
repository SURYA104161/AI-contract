import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import RecentContracts from "../../components/dashboard/RecentContracts";
import QuickActions from "../../components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Welcome Back 👋</h1>

        <p className="text-slate-400 mt-2">AI Contract & Agreement Explainer</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Contracts" value="25" color="text-blue-500" />

        <StatCard title="Average Risk" value="32%" color="text-green-500" />

        <StatCard title="High Risk" value="8" color="text-red-500" />

        <StatCard title="Reports" value="25" color="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2">
          <RecentContracts />
        </div>

        <QuickActions />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
