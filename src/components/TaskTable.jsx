import React from 'react';
import { IconSearch, IconPhone, IconNote, IconCheck } from './Icons';

// Reusable dynamic EmptyState
function EmptyState({ message }) {
  return (
    <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200/80 flex flex-col items-center justify-center p-6 shadow-inner animate-fadeIn select-none">
      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
        {/* Render a check circle inline inside this module */}
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[11px] font-black text-[#0a1629] uppercase tracking-wider">{message}</p>
      <p className="text-[10px] text-slate-400 mt-1 font-semibold">CRM parameters are fully verified and clean.</p>
    </div>
  );
}

// Reusable dynamic priority tags
function PriorityBadge({ priority }) {
  const styles = {
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
    Medium: 'bg-blue-100/50 text-blue-700 border-blue-200',
    High: 'bg-orange-100/50 text-orange-700 border-orange-200 font-bold',
    Critical: 'bg-rose-100/60 text-rose-700 border-rose-200 font-black animate-pulse'
  };
  return (
    <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase leading-none select-none ${styles[priority] || 'bg-slate-50'}`}>
      {priority}
    </span>
  );
}

export default function TaskTable({ 
  tasks, 
  activeTaskTab, 
  setActiveTaskTab, 
  taskPriorityFilter, 
  setTaskPriorityFilter,
  taskSearchTerm,
  setTaskSearchTerm,
  onToggle, 
  onCall, 
  onFollowUp 
}) {
  const tabs = [
    { id: 'overdue', label: '🔴 Overdue Blockers' },
    { id: 'active', label: 'Active Tasks' },
    { id: 'upcoming', label: 'Upcoming Tasks' },
    { id: 'completed', label: 'Completed Tasks' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
      
      {/* Saved View Tabs */}
      <div className="bg-[#f8fafc] border-b border-slate-100 flex items-center justify-between px-4 select-none">
        <div className="flex space-x-2 pt-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTaskTab(tab.id)}
              className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer leading-none ${
                activeTaskTab === tab.id 
                  ? 'border-rose-500 text-[#0a1629] font-black' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border-b border-slate-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-slate-400">
              <IconSearch className="w-3 h-3 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search task subject..."
              value={taskSearchTerm}
              onChange={(e) => setTaskSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md pl-7 pr-3 py-1 text-[10px] placeholder-slate-400 focus:outline-none focus:border-[#ff7a59] w-48 font-semibold text-[#0a1629]"
            />
          </div>

          <select
            value={taskPriorityFilter}
            onChange={(e) => setTaskPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-md px-2 py-1 text-[10px] font-black text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="All">Priority: All</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none select-none">
          Sorted: Overdue ➔ Today ➔ Upcoming
        </span>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] font-sans">
          <thead>
            <tr className="bg-[#f8fafc]/55 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider select-none">
              <th className="px-4 py-2.5 w-10 text-center">Done</th>
              <th className="px-4 py-2.5 min-w-[200px]">Task Subject</th>
              <th className="px-4 py-2.5 w-24">Associated Account</th>
              <th className="px-4 py-2.5 w-24">Due Date</th>
              <th className="px-4 py-2.5 w-20">Priority</th>
              <th className="px-4 py-2.5 w-24 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6">
                  <EmptyState message="🎉 No overdue blockers. All critical tasks completed." />
                </td>
              </tr>
            ) : (
              tasks.map(task => {
                const isOverdue = !task.completed && task.dateBucket === 'Overdue';
                return (
                  <tr 
                    key={task.id} 
                    className={`hover:bg-[#f8fafc]/40 transition-all ${
                      task.completed ? 'opacity-55 bg-slate-50/20' : ''
                    } ${isOverdue ? 'border-l-2 border-l-rose-500 bg-rose-500/[0.01]' : ''}`}
                  >
                    {/* Done */}
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => onToggle(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          task.completed ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white hover:border-orange-500'
                        }`}
                      >
                        {task.completed && <IconCheck className="w-2.5 h-2.5 text-white" />}
                      </button>
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3 font-bold text-[#0a1629]">
                      <div className="flex items-center space-x-1.5">
                        <span className={`truncate ${task.completed ? 'line-through text-slate-400 font-semibold' : ''}`}>
                          {task.title}
                        </span>
                        {isOverdue && (
                          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider animate-pulse flex items-center space-x-0.5 leading-none shrink-0 select-none">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Associated Account */}
                    <td className="px-4 py-3 text-slate-500 font-bold truncate">
                      {task.dealer.split(' ')[0]}
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${isOverdue ? 'text-rose-500 font-bold animate-pulse' : 'text-slate-500'}`}>
                        {task.dueDate}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    {/* Workflow quick CTAs */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2.5 select-none">
                        {!task.completed && (
                          <>
                            <button 
                              onClick={() => onCall(task.id)}
                              className="inline-flex items-center justify-center space-x-1 text-slate-400 hover:text-orange-500 border-transparent bg-transparent px-0 py-0 shadow-none hover:underline font-bold text-[10px] uppercase tracking-wide transition-all cursor-pointer"
                            >
                              <IconPhone className="w-2.5 h-2.5 text-orange-500 mr-1" />
                              Dial
                            </button>
                            <span className="text-slate-200">|</span>
                            <button 
                              onClick={() => onFollowUp(task.title)}
                              className="inline-flex items-center justify-center space-x-1 text-slate-400 hover:text-orange-500 border-transparent bg-transparent px-0 py-0 shadow-none hover:underline font-bold text-[10px] uppercase tracking-wide transition-all cursor-pointer"
                            >
                              <IconNote className="w-2.5 h-2.5 text-slate-400 mr-1" />
                              Note
                            </button>
                          </>
                        )}
                      </div>
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
