import { useState } from 'react';
import InsightsOverview from './InsightsOverview';
import OpportunityDetailModal from './OpportunityDetailModal';

const InsightsTab = () => {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectOpportunity = (id: string) => {
    setSelectedOpportunityId(id);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <InsightsOverview onSelectOpportunity={handleSelectOpportunity} />

      <OpportunityDetailModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        opportunityId={selectedOpportunityId}
      />
    </div>
  );
};

export default InsightsTab;
