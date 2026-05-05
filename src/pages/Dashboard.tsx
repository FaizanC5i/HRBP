import TrendingRolesWithBuckets from '@/components/dashboard/TrendingRolesWithBuckets';
import CompetitorSkillAdoptions from '@/components/dashboard/CompetitorSkillMatrix';
import DashboardKPICards from '@/components/dashboard/DashboardKPICards';
import DemandSupplyChart from '@/components/dashboard/DemandSupplyChart';
import DemandSupplyBarChart from '@/components/dashboard/DemandSupplyBarChart';
import { useDepartment } from '@/contexts/DepartmentContext';

const Dashboard = () => {
  const { selectedDepartment } = useDepartment();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">Here's what's happening in the {selectedDepartment.toLowerCase()} talent market</p>
        </div>
      </div>

      {/* KPI Cards and Demand vs Supply Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* KPI Cards */}
        <DashboardKPICards />

        {/* Demand vs Supply Chart */}
        <DemandSupplyChart />
      </div>

      {/* Trending Roles and Demand vs Supply Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingRolesWithBuckets />
        <DemandSupplyBarChart />
      </div>

      {/* Competitor Skill Adoptions */}
      <CompetitorSkillAdoptions />

    </div>
  );
};

export default Dashboard;
