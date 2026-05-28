import React from 'react';
import { IconNote, IconCalendar, IconBriefcase } from './Icons';

export default function Toolbar({ onCall, onLogUpdate, onCreateTask, onOpenRecord }) {
  return (
    <section className="sticky top-4 z-40 bg-white/95 backdrop-blur-md border border-slate-100 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none select-none">
        Command Actions:
      </span>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Primary Call Trigger with hover interactions */}
        <button 
          onClick={onCall}
          className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all duration-200 cursor-pointer select-none border bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white border-orange-500 shadow-sm active:translate-y-[0.5px]"
        >
          <span>🔥</span>
          <span>Start Sales Call</span>
        </button>

        {/* Log Update */}
        <button 
          onClick={onLogUpdate}
          className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer select-none border bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 active:translate-y-[0.5px]"
        >
          <IconNote className="w-3.5 h-3.5 text-slate-500 mr-1" />
          <span>Log Customer Update</span>
        </button>

        {/* Create Task */}
        <button 
          onClick={onCreateTask}
          className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer select-none border bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 active:translate-y-[0.5px]"
        >
          <IconCalendar className="w-3.5 h-3.5 text-slate-500 mr-1" />
          <span>Create Task</span>
        </button>

        {/* Open record */}
        <button 
          onClick={onOpenRecord}
          className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer select-none border bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 active:translate-y-[0.5px]"
        >
          <IconBriefcase className="w-3.5 h-3.5 text-slate-500 mr-1" />
          <span>Open CRM Record</span>
        </button>
      </div>
    </section>
  );
}
