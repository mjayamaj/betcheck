import React from 'react';
import WhatIfCalculator from '../components/WhatIfCalculator';

export default function CalculatorPage({
  totalLost,
  currency,
  customGoals,
  onAddCustomGoal,
  onDeleteCustomGoal,
}) {
  return (
    <div className="pb-20 md:pb-10">
      <WhatIfCalculator
        totalLost={totalLost}
        currency={currency}
        customGoals={customGoals}
        onAddCustomGoal={onAddCustomGoal}
        onDeleteCustomGoal={onDeleteCustomGoal}
      />
    </div>
  );
}
