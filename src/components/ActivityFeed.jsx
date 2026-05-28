import React, { useState } from 'react';

export default function ActivityFeed({ activities }) {
  const [expandedId, setExpandedId] = useState(null);

  const icons = {
    Call: '📞',
    Email: '✉️',
    Meeting: '📅',
    System: '⚙️',
    Note: '📝'
  };

  const colors = {
    Call: 'bg-orange-50 text-orange-600 border-orange-100',
    Email: 'bg-blue-50 text-blue-600 border-blue-100',
    Meeting: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    System: 'bg-slate-50 text-slate-600 border-slate-100',
    Note: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-2">
      {activities.map(act => {
        const isExpanded = expandedId === act.id;
        return (
          <div 
            key={act.id} 
            className="p-2.5 rounded-lg border border-slate-100 bg-[#f8fafc]/40 hover:bg-slate-50/50 transition-all text-[11px] cursor-pointer"
            onClick={() => toggleExpand(act.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] border ${colors[act.type] || 'bg-slate-50 border-slate-100'} select-none`}>
                  {icons[act.type] || '📄'}
                </span>
                <span className="font-bold text-[#0a1629] truncate max-w-[150px]">
                  {act.type} &bull; {act.detail.split(':')[0]}
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0 select-none">
                <span className="text-[9px] text-slate-400 font-semibold">{act.time}</span>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-500 leading-relaxed animate-fadeIn">
                <p className="font-semibold text-slate-600">{act.detail}</p>
                <span className="text-[8px] text-slate-400 font-bold block mt-1 uppercase tracking-widest select-none">Channel: {act.channel}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
