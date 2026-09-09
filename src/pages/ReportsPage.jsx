import React from 'react';
import WeeklyRealityCheck from '../components/WeeklyRealityCheck';

export default function ReportsPage({
  weeklyData,
  currency,
  onSaveReflection,
}) {
  return (
    <div className="pb-20 md:pb-10">
      <WeeklyRealityCheck
        weeklyData={weeklyData}
        currency={currency}
        onSaveReflection={onSaveReflection}
      />
    </div>
  );
}
