import React from 'react';
import { Info } from 'lucide-react';

const DisclaimerBanner: React.FC = () => {
  return (
    <div className="flex items-start gap-3 p-4 bg-blue-50/70 dark:bg-blue-900/20 backdrop-blur-md border border-blue-100 dark:border-blue-800/30 rounded-xl shadow-sm text-blue-800 dark:text-blue-200">
      <Info className="shrink-0 mt-0.5 text-blue-500 dark:text-blue-400" size={20} />
      <p className="text-sm leading-relaxed">
        <strong>Disclaimer:</strong> GeneGuard AI provides educational wellness insights only. It is not a medical diagnosis. Always consult a qualified healthcare professional.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
