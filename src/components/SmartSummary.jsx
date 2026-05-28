import React from 'react';
import { IconNote } from './Icons';

export default function SmartSummary({ activeProfile, checklist, toggleChecklist }) {
  return (
    <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-2 border-b border-slate-50 pb-2.5 mb-3.5 select-none">
        <IconNote className="w-4 h-4 text-orange-500" />
        <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0a1629]">
          PRE-CALL SALES STRATEGY & ACTION BRIEF
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Objectives Left Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">Conversation briefing note:</h3>
            <p className="mt-1.5 font-bold text-[#0a1629] bg-[#f8fafc] p-3 rounded-lg text-[12px] leading-relaxed shadow-inner">
              "{activeProfile.quickPitchHook}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Pain points */}
            <div className="bg-[#fffbeb]/50 p-3 rounded-lg border border-amber-100 text-[11px]">
              <span className="font-extrabold text-[#92400e] uppercase tracking-wider text-[9px] block select-none">⚠️ Customer Pain Points</span>
              <p className="text-slate-600 mt-1 font-semibold leading-relaxed">
                Vector logo formats supplied in low-res raster formats, completely stalling early mock production runs. Confirm neck labels.
              </p>
            </div>
            {/* Suggested talking points */}
            <div className="bg-[#f0f9ff]/30 p-3 rounded-lg border border-sky-100 text-[11px]">
              <span className="font-extrabold text-sky-800 uppercase tracking-wider text-[9px] block select-none">💡 Suggested Talking Points</span>
              <p className="text-slate-600 mt-1 font-semibold leading-relaxed">
                Offer converting artwork files inside showroom today. Re-validate vector specs and pricing schedules before deposit.
              </p>
            </div>
          </div>
        </div>

        {/* Checklist Right Panel */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block select-none">CRM Pre-call Checklist:</span>
          
          <div className="space-y-2.5">
            {checklist.map(item => (
              <label 
                key={item.id} 
                className="flex items-center space-x-2.5 text-[11px] font-bold text-[#0a1629] cursor-pointer select-none group"
              >
                <input 
                  type="checkbox" 
                  checked={item.checked}
                  onChange={() => toggleChecklist(item.id)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 w-3.5 h-3.5 transition-all group-hover:border-orange-500 cursor-pointer"
                />
                <span className={`transition-all ${item.checked ? 'line-through text-slate-400 font-semibold' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
