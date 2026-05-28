import React from 'react';
import { IconSearch } from './Icons';

// Reusable Stage Badge
function StageBadge({ stage }) {
  const styles = {
    'Negotiation': 'bg-slate-100 text-slate-700 border-slate-200',
    'Quote Sent': 'bg-blue-100/50 text-blue-700 border-blue-200',
    'Proof Approved': 'bg-sky-100/50 text-sky-700 border-sky-200 font-bold',
    'Deposit Received': 'bg-emerald-100/50 text-emerald-700 border-emerald-200 font-bold'
  };
  return (
    <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded border leading-none select-none ${styles[stage] || 'bg-slate-50 border-slate-200'}`}>
      {stage}
    </span>
  );
}

export default function DealTable({ 
  deals, 
  activeDealTab, 
  setActiveDealTab, 
  dealStageFilter, 
  setDealStageFilter,
  dealSearchTerm,
  setDealSearchTerm,
  onAdvance 
}) {
  const tabs = [
    { id: 'open', label: '🟢 Open Deals Only' },
    { id: 'stalled', label: 'Stalled Deals' },
    { id: 'all', label: 'All Deals' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
      
      {/* Saved View Tabs */}
      <div className="bg-[#f8fafc] border-b border-slate-100 flex items-center justify-between px-4 select-none">
        <div className="flex space-x-2 pt-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDealTab(tab.id)}
              className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer leading-none ${
                activeDealTab === tab.id 
                  ? 'border-emerald-600 text-[#0a1629] font-black' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter row */}
      <div className="bg-white border-b border-slate-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-slate-400">
              <IconSearch className="w-3 h-3 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search deal name..."
              value={dealSearchTerm}
              onChange={(e) => setDealSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md pl-7 pr-3 py-1 text-[10px] placeholder-slate-400 focus:outline-none focus:border-[#ff7a59] w-48 font-semibold text-[#0a1629]"
            />
          </div>

          <select
            value={dealStageFilter}
            onChange={(e) => setDealStageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-md px-2 py-1 text-[10px] font-black text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="All">Stage: All</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Quote Sent">Quote Sent</option>
            <option value="Proof Approved">Proof Approved</option>
            <option value="Deposit Received">Deposit Received</option>
          </select>
        </div>

        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none select-none">
          Sorted: Close Date then Value (No Pagination)
        </span>
      </div>

      {/* Spreadsheet List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] font-sans">
          <thead>
            <tr className="bg-[#f8fafc]/55 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider select-none">
              <th className="px-4 py-2.5 min-w-[200px]">Deal Name</th>
              <th className="px-4 py-2.5 w-24">Company</th>
              <th className="px-4 py-2.5 w-24 text-right">Estimated Value</th>
              <th className="px-4 py-2.5 w-24">Stage</th>
              <th className="px-4 py-2.5 w-24">Close Date</th>
              <th className="px-4 py-2.5 w-28">Win Probability</th>
              <th className="px-4 py-2.5 w-20 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {deals.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400 font-bold bg-[#fcfcfc] select-none">
                  No active opportunities match active views.
                </td>
              </tr>
            ) : (
              deals.map(deal => {
                const isHighValue = deal.value >= 15000;
                const isStalled = deal.probability < 50 && deal.stage === 'Negotiation';
                return (
                  <tr 
                    key={deal.id} 
                    className={`hover:bg-[#f8fafc]/40 transition-all ${
                      isHighValue ? 'bg-emerald-500/[0.01] border-l-2 border-l-emerald-600 font-semibold' : ''
                    }`}
                  >
                    {/* Deal Name */}
                    <td className="px-4 py-3 font-bold text-[#0a1629]">
                      <div className="flex items-center space-x-1.5">
                        <span className="truncate">{deal.name}</span>
                        {isHighValue && (
                          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider leading-none shrink-0 animate-pulse select-none">
                            High Value
                          </span>
                        )}
                        {isStalled && (
                          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider leading-none shrink-0 select-none">
                            Stalled
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3 text-slate-500 font-bold truncate">
                      {deal.dealer.split(' ')[0]}
                    </td>

                    {/* Est. Value */}
                    <td className="px-4 py-3 text-right font-black text-emerald-600">
                      ${deal.value.toLocaleString()}
                    </td>

                    {/* Stage */}
                    <td className="px-4 py-3">
                      <StageBadge stage={deal.stage} />
                    </td>

                    {/* Close Date */}
                    <td className="px-4 py-3">
                      <span className="text-slate-500 font-semibold">{deal.closeDate}</span>
                    </td>

                    {/* Win probability progress bar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 select-none">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 border border-slate-200/80 shrink-0">
                          <div 
                            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{deal.probability}%</span>
                      </div>
                    </td>

                    {/* Action advances */}
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => onAdvance(deal.id)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 text-[#0a1629] font-black rounded-md text-[9px] uppercase tracking-wide transition-all cursor-pointer select-none"
                      >
                        ⚡ Stage
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
