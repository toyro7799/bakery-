import React, { useState, useMemo, useEffect } from 'react';
import { BakeryCounts, HistoryRecord, SubInvoice } from './types';
import { calculateTotals, aggregateTotals, aggregateCounts } from './utils/calculation';
import { PRICES } from './constants';
import { Dashboard } from './components/Dashboard';
import { NumberInput } from './components/NumberInput';
import { QuickAddButton } from './components/QuickAddButton';
import { SubInvoiceList } from './components/SubInvoiceList';
import { SubInvoiceDetails } from './components/SubInvoiceDetails';

// Initial State
const INITIAL_COUNTS: BakeryCounts = {
  karousa: 0,
  tajin: 0,
  bread: 0,
  mwerga: 0,
  moshmat: 0,
  kaakSmall: 0,
  kaakLarge: 0,
};

const App: React.FC = () => {
  const [counts, setCounts] = useState<BakeryCounts>(INITIAL_COUNTS);
  const [subInvoices, setSubInvoices] = useState<SubInvoice[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // UI State for expanding details
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [expandedSubInvoiceId, setExpandedSubInvoiceId] = useState<string | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bakery_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    // Adjusted scroll handler for the internal scroll container if needed, 
    // but here we are using window scroll. Since we are framing it, 
    // the scroll might be on the window or the container. 
    // Let's stick to window for simplicity as the frame is centered.
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Calculate totals for CURRENT input
  const currentTotals = useMemo(() => calculateTotals(counts), [counts]);

  // 2. Calculate totals for SAVED sub-invoices
  const accumulatedTotals = useMemo(() => aggregateTotals(subInvoices.map(s => s.totals)), [subInvoices]);

  // 3. Grand Total (Accumulated + Current)
  const grandTotals = useMemo(() => aggregateTotals([accumulatedTotals, currentTotals]), [accumulatedTotals, currentTotals]);

  // Handlers to update specific counts
  const updateCount = (key: keyof BakeryCounts, value: number) => {
    setCounts(prev => ({ ...prev, [key]: value }));
  };

  const handleResetCurrent = () => {
    if (confirm('هل تريد تصفير العدادات الحالية؟')) {
      setCounts(INITIAL_COUNTS);
    }
  };

  const handleAddSubInvoice = () => {
    if (currentTotals.totalPrice === 0) return;

    const newSubInvoice: SubInvoice = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' }),
      counts: { ...counts },
      totals: { ...currentTotals }
    };

    setSubInvoices([...subInvoices, newSubInvoice]);
    setCounts(INITIAL_COUNTS);
  };

  const removeSubInvoice = (id: string) => {
    if(confirm('حذف هذه الفاتورة الفرعية؟')) {
      setSubInvoices(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const handleFinalizeInvoice = () => {
    if (grandTotals.totalPrice === 0) return;

    // If there is active input, add it as a sub-invoice first implicitly
    let finalSubInvoices = [...subInvoices];
    if (currentTotals.totalPrice > 0) {
      finalSubInvoices.push({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' }),
        counts: { ...counts },
        totals: { ...currentTotals }
      });
    }

    const aggregatedCounts = aggregateCounts(finalSubInvoices.map(s => s.counts));
    const aggregatedTotals = aggregateTotals(finalSubInvoices.map(s => s.totals));

    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ar-LY'),
      counts: aggregatedCounts,
      totals: aggregatedTotals,
      subInvoices: finalSubInvoices
    };

    const newHistory = [newRecord, ...history];
    setHistory(newHistory);
    localStorage.setItem('bakery_history', JSON.stringify(newHistory));
    
    setSubInvoices([]);
    setCounts(INITIAL_COUNTS);
    alert('تم حفظ الفاتورة الرئيسية بنجاح!');
  };

  const clearHistory = () => {
    if (confirm('حذف السجل بالكامل؟')) {
      setHistory([]);
      localStorage.removeItem('bakery_history');
    }
  };

  // Helper for condensed summary
  const totalItems = grandTotals.totalBread + grandTotals.totalPastryCount;

  return (
    <div className="min-h-screen bg-stone-100 py-4 px-2 sm:py-8 flex justify-center items-start font-sans overflow-x-hidden">
      {/* The Main Frame Container */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border-[6px] border-bakery-500 overflow-hidden relative flex flex-col min-h-[85vh]">
        
        {/* The "Hat" - Header Section */}
        <div className="bg-bakery-500 text-white pt-6 pb-6 px-6 rounded-t-[2rem] relative z-20 shadow-lg">
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl font-black flex items-center gap-2 drop-shadow-md">
                  <span className="text-3xl">🥖</span>
                  الخباز الذكي
                </h1>
                {/* Live Summary inside the Hat */}
                <div className="flex items-center gap-3 mt-2 text-bakery-50 font-bold text-sm bg-bakery-600/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-bakery-400">
                   <span>{totalItems} قطعة</span>
                   <span className="w-1 h-1 rounded-full bg-bakery-200"></span>
                   <span className="text-white">{grandTotals.totalPrice.toFixed(2)} د.ل</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white text-bakery-600 px-4 py-2 rounded-xl font-bold shadow-md hover:bg-bakery-50 transition-transform active:scale-95"
              >
                {showHistory ? 'العودة' : 'السجل'}
              </button>
           </div>
        </div>

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white pb-32">
          <main className="px-4 py-6">
            
            {showHistory ? (
              <div className="space-y-4 animate-fadeIn">
                 <div className="flex justify-between items-center mb-4 px-2">
                    <h2 className="text-xl font-bold text-gray-800 border-r-4 border-bakery-500 pr-3">سجل الفواتير</h2>
                    {history.length > 0 && (
                      <button onClick={clearHistory} className="text-red-500 text-sm font-bold bg-red-50 px-3 py-1 rounded-lg">
                        مسح
                      </button>
                    )}
                 </div>
                 
                 {history.length === 0 ? (
                   <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
                     <span className="text-4xl grayscale opacity-50">📚</span>
                     <span>السجل فارغ</span>
                   </div>
                 ) : (
                   history.map(record => (
                     <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                       <div 
                         className="p-4 cursor-pointer hover:bg-gray-50 relative"
                         onClick={() => setExpandedHistoryId(expandedHistoryId === record.id ? null : record.id)}
                       >
                         <div className="flex justify-between items-start mb-2">
                           <div className="text-sm text-gray-500 font-medium">{record.date}</div>
                           <div className="font-black text-lg text-bakery-600">{record.totals.totalPrice.toFixed(2)} د.ل</div>
                         </div>
                         <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                           <div className="flex flex-col items-center">
                             <span className="text-gray-400 mb-1">خبز</span>
                             <span className="text-base font-bold text-gray-800">{record.totals.totalBread}</span>
                           </div>
                           <div className="flex flex-col items-center border-x border-stone-200">
                             <span className="text-gray-400 mb-1">طاجين</span>
                             <span className="text-base font-bold text-gray-800">{record.totals.totalTajin}</span>
                           </div>
                           <div className="flex flex-col items-center">
                             <span className="text-gray-400 mb-1">حلويات</span>
                             <span className="text-base font-bold text-gray-800">{record.totals.totalPastryCount}</span>
                           </div>
                         </div>
                         
                         {/* Expand/Collapse Indicator */}
                         {record.subInvoices && record.subInvoices.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-center text-bakery-500 font-bold flex items-center justify-center gap-1">
                              {expandedHistoryId === record.id ? 'إخفاء التفاصيل' : `عرض ${record.subInvoices.length} دفعات`}
                              <svg className={`w-3 h-3 transition-transform duration-200 ${expandedHistoryId === record.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                         )}
                       </div>

                       {/* Expanded Details: List of Sub Invoices */}
                       {expandedHistoryId === record.id && record.subInvoices && (
                         <div className="bg-stone-50 border-t border-gray-100 p-3 space-y-2">
                            {record.subInvoices.map((sub, idx) => (
                              <div key={sub.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Sub Invoice Header - Clickable */}
                                <div 
                                  className="p-3 text-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 select-none"
                                  onClick={() => setExpandedSubInvoiceId(expandedSubInvoiceId === sub.id ? null : sub.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-bakery-100 text-bakery-700 rounded-full flex items-center justify-center text-xs font-bold">#{idx + 1}</span>
                                    <span className="text-xs text-gray-400">{sub.timestamp}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800">{sub.totals.totalPrice.toFixed(2)} د.ل</span>
                                    <svg 
                                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedSubInvoiceId === sub.id ? 'rotate-180' : ''}`} 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Detailed Breakdown for this Sub Invoice */}
                                {expandedSubInvoiceId === sub.id && (
                                  <div className="bg-bakery-50/30 p-4 border-t border-gray-100">
                                    <SubInvoiceDetails counts={sub.counts} />
                                  </div>
                                )}
                              </div>
                            ))}
                         </div>
                       )}
                     </div>
                   ))
                 )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main Dashboard showing Grand Totals */}
                <Dashboard totals={grandTotals} />
                
                {/* List of accumulated sub-invoices */}
                <SubInvoiceList subInvoices={subInvoices} onRemove={removeSubInvoice} />

                {/* Section Divider */}
                <div className="relative py-2">
                   <div className="absolute inset-0 flex items-center" aria-hidden="true">
                     <div className="w-full border-t border-gray-200"></div>
                   </div>
                   <div className="relative flex justify-center">
                     <span className="px-3 bg-white text-sm font-bold text-gray-400">إدخال الكميات</span>
                   </div>
                </div>

                {/* Bread Section */}
                <div className="space-y-4">
                    <NumberInput
                      label="عدد الكاروسات"
                      value={counts.karousa}
                      onChange={(val) => updateCount('karousa', val)}
                      placeholder="0"
                      bgColor="bg-blue-50"
                      borderColor="border-blue-100"
                      textColor="text-blue-600"
                      icon="🛒"
                    />
                    <NumberInput
                      label="عدد الطواجين"
                      value={counts.tajin}
                      onChange={(val) => updateCount('tajin', val)}
                      placeholder="0"
                      bgColor="bg-emerald-50"
                      borderColor="border-emerald-100"
                      textColor="text-emerald-600"
                      icon="🥘"
                    />
                     <NumberInput
                      label="خبز فردي"
                      value={counts.bread}
                      onChange={(val) => updateCount('bread', val)}
                      step={10}
                      placeholder="0"
                      bgColor="bg-orange-50"
                      borderColor="border-orange-100"
                      textColor="text-orange-600"
                      icon="🥖"
                    />
                </div>

                {/* Pastry Section Divider */}
                <div className="relative py-2 mt-8">
                   <div className="absolute inset-0 flex items-center" aria-hidden="true">
                     <div className="w-full border-t border-dashed border-gray-300"></div>
                   </div>
                   <div className="relative flex justify-center">
                     <span className="px-3 bg-white text-sm font-bold text-gray-400">الحلويات</span>
                   </div>
                </div>

                {/* Pastry Section */}
                <div className="space-y-4">
                  <div className="mb-4">
                     <NumberInput
                      label={`المورقة (${PRICES.MWERGA} د.ل)`}
                      value={counts.mwerga}
                      onChange={(val) => updateCount('mwerga', val)}
                      placeholder="0"
                      bgColor="bg-pink-50"
                      borderColor="border-pink-100"
                      textColor="text-pink-600"
                      icon="🥐"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <QuickAddButton 
                        label="مشماط"
                        subLabel={`${PRICES.MOSHMAT} د.ل`}
                        count={counts.moshmat}
                        onChange={(val) => updateCount('moshmat', val)}
                        colorClass="bg-rose-50 border-rose-100"
                     />
                     <QuickAddButton 
                        label="كعك صغير"
                        subLabel={`${PRICES.KAAK_SMALL} د.ل`}
                        count={counts.kaakSmall}
                        onChange={(val) => updateCount('kaakSmall', val)}
                        colorClass="bg-amber-50 border-amber-100"
                     />
                  </div>
                  <div>
                     <QuickAddButton 
                        label="كعك كبير"
                        subLabel={`${PRICES.KAAK_LARGE} د.ل`}
                        count={counts.kaakLarge}
                        onChange={(val) => updateCount('kaakLarge', val)}
                        colorClass="bg-orange-50 border-orange-100"
                     />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Floating Action Bar - Inside the frame but fixed at bottom of it */}
        {!showHistory && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30">
             <div className="grid grid-cols-5 gap-3">
               
               {/* Reset Button - 1 column */}
               <button 
                 onClick={handleResetCurrent}
                 disabled={currentTotals.totalPrice === 0}
                 className="col-span-1 h-14 rounded-2xl border-2 border-gray-100 text-gray-400 font-bold hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50"
                 aria-label="Reset Current"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
               </button>

               {/* Add Sub-Invoice Button - 2 columns */}
               <button 
                 onClick={handleAddSubInvoice}
                 disabled={currentTotals.totalPrice === 0}
                 className="col-span-2 h-14 rounded-2xl bg-bakery-50 text-bakery-700 font-bold text-sm border-2 border-bakery-200 hover:bg-bakery-100 active:scale-[0.98] transition-all flex flex-col items-center justify-center leading-tight disabled:opacity-50 disabled:grayscale"
               >
                 <span>+ دفعة</span>
                 {currentTotals.totalPrice > 0 && <span className="text-xs opacity-75">{currentTotals.totalPrice.toFixed(2)} د.ل</span>}
               </button>

               {/* Finish Main Invoice - 2 columns */}
               <button 
                 onClick={handleFinalizeInvoice}
                 disabled={grandTotals.totalPrice === 0}
                 className="col-span-2 h-14 rounded-2xl bg-bakery-500 text-white font-bold text-lg shadow-lg shadow-bakery-200 hover:bg-bakery-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
               >
                 <span>حفظ</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;