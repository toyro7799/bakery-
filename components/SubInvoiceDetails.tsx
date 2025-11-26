import React from 'react';
import { BakeryCounts } from '../types';
import { PRICES, CONVERSIONS, KAROUSA_TO_BREAD } from '../constants';

interface DetailRowProps {
  label: string;
  count: number;
  unitPrice: number;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, count, unitPrice }) => {
  if (count === 0) return null;
  const total = count * unitPrice;
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">x{count}</span>
      </div>
      <div className="font-bold text-gray-800">{total.toFixed(2)} د.ل</div>
    </div>
  );
};

export const SubInvoiceDetails: React.FC<{ counts: BakeryCounts }> = ({ counts }) => {
  // Calculate effective unit prices for compound items
  const karousaPrice = KAROUSA_TO_BREAD * PRICES.BREAD;
  const tajinPrice = CONVERSIONS.TAJIN_TO_BREAD * PRICES.BREAD;

  // Cast val to number since Object.values can return unknown[] in strict mode
  const hasItems = Object.values(counts).some((val) => (val as number) > 0);

  if (!hasItems) {
    return <div className="text-gray-400 text-xs text-center py-2">لا توجد عناصر</div>;
  }

  return (
    <div className="space-y-0.5 animate-fadeIn">
      <DetailRow label="كاروسة" count={counts.karousa} unitPrice={karousaPrice} />
      <DetailRow label="طاجين" count={counts.tajin} unitPrice={tajinPrice} />
      <DetailRow label="خبز فردي" count={counts.bread} unitPrice={PRICES.BREAD} />
      <DetailRow label="مورقة" count={counts.mwerga} unitPrice={PRICES.MWERGA} />
      <DetailRow label="مشماط" count={counts.moshmat} unitPrice={PRICES.MOSHMAT} />
      <DetailRow label="كعك صغير" count={counts.kaakSmall} unitPrice={PRICES.KAAK_SMALL} />
      <DetailRow label="كعك كبير" count={counts.kaakLarge} unitPrice={PRICES.KAAK_LARGE} />
    </div>
  );
};