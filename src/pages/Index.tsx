import { useState } from 'react';
import { AuditForm, AuditResults } from '@/components/AuditForm';
import { AuditReport } from '@/components/AuditReport';

const Index = () => {
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);

  const handleAuditComplete = (results: AuditResults) => {
    setAuditResults(results);
  };

  const handleNewAudit = () => {
    setAuditResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {!auditResults ? (
          <div className="flex items-center justify-center min-h-screen">
            <AuditForm onAuditComplete={handleAuditComplete} />
          </div>
        ) : (
          <AuditReport results={auditResults} onNewAudit={handleNewAudit} />
        )}
      </div>
    </div>
  );
};

export default Index;
