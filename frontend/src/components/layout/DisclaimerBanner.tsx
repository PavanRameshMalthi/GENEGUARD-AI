import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 text-sm flex items-center justify-center gap-2">
      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
      <p className="text-center font-medium">
        <strong>Disclaimer:</strong> GeneGuard AI provides AI-generated wellness guidance for educational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional.
      </p>
    </div>
  );
};
