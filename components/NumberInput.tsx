import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
  step?: number;
  placeholder?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  label, 
  value, 
  onChange, 
  icon, 
  step = 1, 
  placeholder = "0",
  bgColor = "bg-white",
  textColor = "text-gray-800",
  borderColor = "border-gray-200"
}) => {
  return (
    <div className={`p-4 rounded-[2rem] shadow-sm border ${borderColor} ${bgColor} flex flex-col gap-3 transition-all hover:shadow-md`}>
      <label className={`text-base font-extrabold flex items-center gap-2 ${textColor.replace('text-', 'text-opacity-80 text-')} px-1`}>
        {icon && <span className="opacity-75 text-xl">{icon}</span>}
        {label}
      </label>
      <div className="flex items-center justify-center gap-2">
        <button 
          onClick={() => onChange(Math.max(0, value - step))}
          className={`w-20 h-20 shrink-0 rounded-xl bg-white border-4 ${borderColor} text-gray-400 flex items-center justify-center text-5xl font-black hover:bg-gray-50 active:scale-95 transition-all touch-manipulation pb-2`}
        >
          -
        </button>
        <input
          type="number"
          min="0"
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            onChange(val);
          }}
          onFocus={(e) => e.target.select()}
          placeholder={placeholder}
          className={`w-32 h-20 rounded-xl ${borderColor} border-4 text-center font-black text-5xl ${textColor} bg-white/60 focus:ring-4 focus:ring-opacity-20 focus:outline-none transition-all placeholder-gray-300`}
        />
        <button 
          onClick={() => onChange(value + step)}
          className={`w-20 h-20 shrink-0 rounded-xl border-4 border-transparent ${textColor.replace('text-', 'bg-')} text-white flex items-center justify-center text-5xl font-black hover:opacity-90 active:scale-95 transition-all shadow-md touch-manipulation pb-2`}
        >
          +
        </button>
      </div>
    </div>
  );
};