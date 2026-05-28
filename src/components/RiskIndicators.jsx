import React from 'react';
import { IconTrendUp, IconBriefcase, IconClock } from './Icons';

// CUSTOMER SNAPSHOT
export function CustomerSnapshot({ profile }) {
  const isApex = profile.name.includes('Apex');
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
      <div className="border-b border-slate-50 pb-2 mb-3 select-none">
        <span className="text-[11px] font-black text-[#0a1629] uppercase tracking-wider block">
          QUICK CUSTOMER SNAPSHOT
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[9px] font-bold uppercase select-none">Customer Since</span>
          <span className="font-extrabold text-[#0a1629] mt-0.5 block">{isApex ? 'Oct 2021' : 'Jan 2023'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px] font-bold uppercase select-none">Last Order Amount</span>
          <span className="font-extrabold text-[#0a1629] mt-0.5 block">{isApex ? '$14,200' : '$8,400'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px] font-bold uppercase select-none">Open Tickets</span>
          <span className="font-extrabold text-rose-600 mt-0.5 block">{isApex ? '2 Active' : '0 Pending'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px] font-bold uppercase select-none">Preferred Channel</span>
          <span className="font-extrabold text-[#0a1629] mt-0.5 block">{isApex ? 'Zoom / Video' : 'In-Person'}</span>
        </div>
        <div className="col-span-2 border-t border-slate-50 pt-2.5">
          <span className="text-slate-400 block text-[9px] font-bold uppercase select-none">Engagement Trend Status</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-black text-slate-700 uppercase text-[9px]">{isApex ? 'High Priority Touch' : 'Swatch confirmation'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// CUSTOMER HEALTH GAUGE CIRCLE SVG
export function CustomerHealthCard({ healthScore, overdueCount, StallCount }) {
  let status = '🟢 HEALTHY';
  let colorClass = 'text-emerald-500';
  let strokeColor = '#10b981';
  let summary = 'Active engagement, clean pipeline parameters, and all immediate touchpoints verified.';

  if (overdueCount > 0 && overdueCount <= 2) {
    status = '🟡 NEEDS ATTENTION';
    colorClass = 'text-amber-500';
    strokeColor = '#f59e0b';
    summary = 'Slight follow-up lag detected. Swatches and logo proofs require validation today.';
  } else if (overdueCount > 2 || StallCount > 0) {
    status = '🔴 AT RISK';
    colorClass = 'text-rose-500';
    strokeColor = '#f43f5e';
    summary = 'Critical overdue tasks present. High possibility of deal stalled. Call Mike Ross immediately.';
  }

  const scoreVal = parseInt(healthScore);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreVal / 100) * circumference;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
      
      <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3 select-none">
        <span className="text-[11px] font-black text-[#0a1629] uppercase tracking-wider block">
          CUSTOMER HEALTH INTELLIGENCE
        </span>
        <span className={`text-[9px] font-black uppercase tracking-wider ${colorClass}`}>
          {status}
        </span>
      </div>

      <div className="flex items-start space-x-4">
        {/* SVG gauge */}
        <div className="relative shrink-0 w-11 h-11 flex items-center justify-center bg-slate-50 rounded-full border border-slate-100">
          <svg className="w-10 h-10 transform -rotate-90">
            <circle cx="20" cy="20" r={radius} stroke="#f1f5f9" strokeWidth="3.5" fill="transparent" />
            <circle 
              cx="20" 
              cy="20" 
              r={radius} 
              stroke={strokeColor} 
              strokeWidth="4" 
              fill="transparent" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10px] font-black text-[#0a1629]">{healthScore}</span>
        </div>

        <div className="text-[11px] leading-normal text-slate-500 space-y-2 flex-1">
          <p className="font-semibold text-slate-700">{summary}</p>
          
          <div className="flex items-center justify-between pt-1 text-[9px] font-extrabold text-slate-400 uppercase select-none">
            <span className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              <IconTrendUp className="w-3 h-3 text-emerald-600" />
              <span>+4% Trend</span>
            </span>
            <div className="flex items-end space-x-0.5 h-4 shrink-0">
              <span className="w-1 h-2 bg-slate-200 rounded-full"></span>
              <span className="w-1 h-3 bg-slate-200 rounded-full"></span>
              <span className="w-1 h-4 bg-slate-300 rounded-full"></span>
              <span className="w-1 h-2.5 bg-orange-400 rounded-full"></span>
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
