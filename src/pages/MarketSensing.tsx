import InsightsTab from '@/components/insights/InsightsTab';

const MarketSensing = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Business Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Strategic market intelligence and opportunity analysis
          </p>
        </div>
      </div>

      {/* Insights Section */}
      <InsightsTab />
    </div>
  );
};

export default MarketSensing;
