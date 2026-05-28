import React from 'react';
import { IconClock } from './Icons';

export default function MeetingPanel({ meetings }) {
  if (meetings.length === 0) {
    return (
      <div className="py-6 text-center text-slate-400 bg-[#f8fafc]/55 rounded-xl border border-dashed border-slate-200/80 p-4 font-bold text-[10px] uppercase select-none shadow-inner">
        No scheduled customer meetings.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map(m => (
        <div 
          key={m.id}
          className={`p-3 rounded-xl border transition-all ${
            m.active ? 'bg-sky-50/20 border-sky-200' : 'bg-white border-slate-200/80'
          } text-[11px]`}
        >
          <div className="flex justify-between items-center select-none">
            <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-md ${
              m.active ? 'bg-[#ff7a59] text-white animate-pulse' : 'bg-slate-100 text-slate-500'
            }`}>
              {m.active ? 'Up Next' : 'Scheduled'}
            </span>
            <span className="text-[9px] text-[#ff7a59] font-black bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded">{m.duration}</span>
          </div>

          <h4 className="font-extrabold mt-2 text-[#0a1629] leading-snug">{m.title}</h4>
          
          <p className="text-sky-600 font-bold text-[9px] mt-1.5 flex items-center space-x-1 select-none">
            <IconClock className="w-2.5 h-2.5 text-sky-500 mr-1" />
            <span>Time: {m.time} &bull; Participant: {m.keyAttendee}</span>
          </p>
          
          {m.active && (
            <div className="mt-2.5 bg-white p-2.5 rounded-lg border border-slate-200/60 text-[9px] space-y-1">
              <span className="font-extrabold text-slate-500 block uppercase tracking-wider text-[8px] text-[#ff7a59] select-none">Discussion Objectives:</span>
              <p className="text-slate-500 leading-relaxed font-semibold">
                Verify sublimation proof colors, double check custom neck collars, and match wholesale pricing.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
