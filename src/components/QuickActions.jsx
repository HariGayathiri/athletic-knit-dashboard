import React from 'react';

export function NoteForm({ noteText, setNoteText, onSubmit, onClose }) {
  return (
    <form onSubmit={onSubmit} className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex flex-col gap-2 shadow-inner animate-fadeIn">
      <div className="flex justify-between items-center select-none">
        <span className="text-[10px] font-black text-[#ff7a59] uppercase tracking-wider">📝 Log Inline CRM Note</span>
        <button type="button" onClick={onClose} className="text-slate-400 text-xs font-bold hover:text-slate-600 cursor-pointer">×</button>
      </div>
      <textarea 
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Log notes about custom jersey layouts, logo sizing blocks, showroom pricing, or physical varsity fabric swatch receipt..."
        className="w-full bg-white border border-slate-200 p-3 rounded-lg text-[12px] focus:outline-none focus:border-[#ff7a59] text-[#0a1629] font-semibold"
        rows={2}
        autoFocus
      />
      <div className="flex justify-end space-x-2 select-none">
        <button type="button" onClick={onClose} className="px-3 py-1 text-[9px] font-black text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer">Cancel</button>
        <button type="submit" className="px-3 py-1 text-[9px] font-black text-white bg-[#ff7a59] rounded-md cursor-pointer hover:bg-[#ff6a43]">Save Note</button>
      </div>
    </form>
  );
}

export function TaskForm({ newTaskTitle, setNewTaskTitle, newTaskPriority, setNewTaskPriority, onSubmit, onClose }) {
  return (
    <form onSubmit={onSubmit} className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex flex-col gap-2 shadow-inner animate-fadeIn">
      <div className="flex justify-between items-center select-none">
        <span className="text-[10px] font-black text-[#0091ae] uppercase tracking-wider">➕ Create Pre-Call Follow-up Task</span>
        <button type="button" onClick={onClose} className="text-slate-400 text-xs font-bold hover:text-slate-600 cursor-pointer">×</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Task subject details description..."
          className="bg-white border border-slate-200 p-2 rounded-lg text-[12px] focus:outline-none focus:border-slate-900 font-bold"
          autoFocus
        />
        <select 
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="bg-white border border-slate-200 p-2 rounded-lg text-[12px] font-black text-slate-600 focus:outline-none cursor-pointer"
        >
          <option value="Critical">Critical Priority</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 select-none">
        <button type="button" onClick={onClose} className="px-3 py-1 text-[9px] font-black text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer">Cancel</button>
        <button type="submit" className="px-3 py-1 text-[9px] font-black text-white bg-slate-900 rounded-md cursor-pointer hover:bg-black">Save Task</button>
      </div>
    </form>
  );
}
