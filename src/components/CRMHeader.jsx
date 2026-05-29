import React from 'react';
import { IconBriefcase, IconClock } from './Icons';

// Sub components for Top Nav
function MetricCard({ value, label, subtext, colorClass, highlightBorder, badgeContent, pulse }) {
  return (
    <div className={`bg-slate-900/40 backdrop-blur-xs border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3 transition-all duration-300 hover:${highlightBorder}`}>
      <div className="relative">
        <span className={`w-6 h-6 rounded-full ${colorClass} text-xs font-black flex items-center justify-center`}>
          {badgeContent || value}
        </span>
        {pulse && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
        )}
      </div>
      <div>
        <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-none">{label}</div>
        <div className={`text-xs font-black mt-1 ${colorClass.includes('text-rose') ? 'text-rose-500' : colorClass.includes('text-emerald') ? 'text-emerald-400' : 'text-white'}`}>{subtext}</div>
      </div>
    </div>
  );
}

export default function CRMHeader({ activeProfile, activePipelineValue, overdueCount, openDealsCount, onSwitchProfile }) {
  return (
    <div className="bg-[#0a1629] text-[#f5f8fa] px-6 py-3.5 border-b border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none">
      
      {/* Branding context block */}
      <div className="flex items-center space-x-4">
        <div className="w-8.5 h-8.5 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-lg flex items-center justify-center font-black text-white text-md shadow-md tracking-tighter shrink-0">
          AK
        </div>
        <div>
          <div className="flex items-center space-x-2 leading-none">
            <span className="text-[8px] uppercase tracking-widest font-black text-slate-500">Sales Execution Workspace</span>
            <span className="text-[9px] text-slate-400 font-bold">
              | Rep: {activeProfile.contactPerson || 'Loading...'}
            </span>
          </div>
          <div className="flex items-center space-x-2.5 mt-1.5">
            <span className="text-white text-sm font-black">
              🏢 {activeProfile.name || 'Loading contact...'}
            </span>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest select-none leading-none">
              {activeProfile.artworkStatus || 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>


      {/* KPI stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto">
        {/* Overdue */}
        <MetricCard 
          label="Overdue Tasks"
          subtext={`${overdueCount} Critical`}
          colorClass="bg-rose-500/10 text-rose-500"
          highlightBorder="border-rose-500/30"
          badgeContent={overdueCount}
          pulse={overdueCount > 0}
        />

        {/* Pipeline Value */}
        <MetricCard 
          label="Pipeline Value"
          subtext={`$${activePipelineValue.toLocaleString()}`}
          colorClass="bg-emerald-500/10 text-emerald-500 font-bold"
          highlightBorder="border-emerald-500/30"
          badgeContent="$"
        />

        {/* Active opportunities */}
        <MetricCard 
          label="Opportunities"
          subtext={`${openDealsCount} Deals`}
          colorClass="bg-orange-500/10 text-orange-500"
          highlightBorder="border-orange-500/30"
          badgeContent={<IconBriefcase className="w-3 h-3 text-orange-500" />}
        />

        {/* Last Customer Touch */}
        <MetricCard 
          label="Last Contact"
          subtext={activeProfile.lastInteraction}
          colorClass="bg-sky-500/10 text-sky-500"
          highlightBorder="border-sky-500/30"
          badgeContent={<IconClock className="w-3 h-3 text-sky-500" />}
        />
      </div>

    </div>
  );
}
