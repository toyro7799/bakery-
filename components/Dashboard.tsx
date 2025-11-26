import React from 'react';
import { CalculatedTotals } from '../types';

interface DashboardProps {
  totals: CalculatedTotals;
}

export const Dashboard: React.FC<DashboardProps> = ({ totals }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-bakery-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <h2 className="text-gray-400 text-sm font-medium mb-1">الإجمالي الكلي (اليوم)</h2>
        <div className="text-5xl font-extrabold tracking-tight text-white mb-6 flex items-baseline gap-2">
          {totals.totalPrice.toFixed(2)} 
          <span className="text-xl text-bakery-400 font-bold">دينار</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="text-xs text-gray-300 mb-1">إجمالي الخبز</div>
            <div className="text-2xl font-bold">{totals.totalBread.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="text-xs text-gray-300 mb-1">إجمالي الطواجين</div>
            <div className="text-2xl font-bold">{totals.totalTajin.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="text-xs text-gray-300 mb-1">إجمالي الكاروسات</div>
            <div className="text-2xl font-bold">{totals.totalKarousa.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="text-xs text-gray-300 mb-1">قطع الحلويات</div>
            <div className="text-2xl font-bold">{totals.totalPastryCount.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};