import React from 'react';

interface QuickAddButtonProps {
  label: string;
  subLabel: string;
  count: number;
  onChange: (val: number) => void;
  colorClass?: string;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  label,
  subLabel,
  count,
  onChange,
  colorClass = "bg-white"
}) => {
  return (
    <div className={`relative p-3 rounded-3xl shadow-sm border border-gray-100 ${colorClass} flex flex-col items-center justify-between gap-4 overflow-hidden transition-all duration-200 hover:shadow-md`}>
      <div className="text-center w-full relative z-10 pt-1">
        <div className="font-extrabold text-gray-800 text-lg leading-tight">{label}</div>
        <div className="text-xs font-black text-gray-500 bg-white/60 px-2 py-0.5 rounded-full inline-block mt-1">
          {subLabel}
        </div>
      </div>
      
      {/* Decorative background number */}
      <div className="text-7xl font-black text-gray-900/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 select-none">
        {count}
      </div>

      <div className="flex items-center gap-2 w-full z-10">
        <button 
          onClick={() => onChange(Math.max(0, count - 1))}
          disabled={count === 0}
          className="w-14 h-14 shrink-0 rounded-xl bg-white border-4 border-gray-100 text-gray-400 disabled:opacity-30 disabled:border-transparent hover:text-red-500 hover:border-red-200 hover:bg-red-50 active:scale-95 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-red-200 touch-manipulation"
          aria-label="Decrease"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
        </button>
        
        <div className="flex-1 relative">
           <input
            type="number"
            min="0"
            value={count === 0 ? '' : count}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : parseInt(e.target.value);
              onChange(isNaN(val) ? 0 : val);
            }}
            onFocus={(e) => e.target.select()}
            placeholder="0"
            className="w-full h-14 bg-transparent text-center font-black text-3xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-0 p-0 appearance-none"
          />
        </div>

        <button 
          onClick={() => onChange(count + 1)}
          className="w-14 h-14 shrink-0 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 touch-manipulation border-4 border-transparent"
          aria-label="Increase"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>
    </div>
  );
};