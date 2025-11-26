import React from 'react';
import { SubInvoice } from '../types';

interface SubInvoiceListProps {
  subInvoices: SubInvoice[];
  onRemove?: (id: string) => void;
}

export const SubInvoiceList: React.FC<SubInvoiceListProps> = ({ subInvoices, onRemove }) => {
  if (subInvoices.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-500 px-1">
        <span className="font-bold">الفواتير الفرعية ({subInvoices.length})</span>
      </div>
      <div className="grid gap-3">
        {subInvoices.map((invoice, index) => (
          <div key={invoice.id} className="bg-white border-l-4 border-bakery-400 rounded-r-xl p-3 shadow-sm flex justify-between items-center animate-fadeIn">
            <div>
              <div className="text-xs text-gray-400 font-bold mb-1">فاتورة فرعية #{index + 1}</div>
              <div className="flex gap-3 text-sm text-gray-600">
                {invoice.totals.totalBread > 0 && (
                   <span>🥖 {invoice.totals.totalBread}</span>
                )}
                {invoice.totals.totalPastryCount > 0 && (
                   <span>🧁 {invoice.totals.totalPastryCount}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-800">{invoice.totals.totalPrice.toFixed(2)} د.ل</span>
              {onRemove && (
                <button 
                  onClick={() => onRemove(invoice.id)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};