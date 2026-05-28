import { useState, useEffect } from 'react';

// ============================================================================
// 1. MODULAR COMPONENT IMPORTS
// ============================================================================
import { IconPhone, IconAlert, IconCalendar, IconClock, IconSparkles } from './components/Icons';
import CRMHeader from './components/CRMHeader';
import SmartSummary from './components/SmartSummary';
import Toolbar from './components/Toolbar';
import { NoteForm, TaskForm } from './components/QuickActions';
import TaskTable from './components/TaskTable';
import DealTable from './components/DealTable';
import { CustomerSnapshot, CustomerHealthCard } from './components/RiskIndicators';
import MeetingPanel from './components/MeetingPanel';
import ActivityFeed from './components/ActivityFeed';

// ============================================================================
// 2. MODULAR DATA & SERVICE LAYER IMPORTS
// ============================================================================
import { initialChecklist } from './data/mockData';
import { 
  getCompanyProfile, 
  getTasks, 
  getDeals, 
  getActivities, 
  getUpcomingMeetings,
  updateDealStage 
} from './services/hubspotService';

// AI INSIGHT WIDGET
function SmartAIRecommendation({ overdueCount }) {
  const advice = overdueCount > 0
    ? "Discuss sublimation mockup proof approvals immediately before pricing negotiations. Apex Hockey Distributors is currently blocked on logo confirmation."
    : "Review catalog wholesale price list schedules before closing physical varsity swatch reviews. Build trust on sample deliveries.";

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none select-text">
      <div className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full bg-sky-500/5 blur-xl"></div>
      
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 mb-2 select-none">
        <IconSparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
        <span className="text-[9.5px] font-black uppercase tracking-wider text-sky-400">
          Smart Sales Operations Recommendation
        </span>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-300 font-bold">
        "{advice}"
      </p>
    </div>
  );
}

// ============================================================================
// 3. CORE INTEGRATED APP WORKSPACE
// ============================================================================

function App() {
  // Read the real HubSpot contact ID from URL query parameters
  // NewCard.tsx passes this as: ?contactId=<HubSpot Contact ID>
  const urlParams = new URLSearchParams(window.location.search);
  const urlContactId = urlParams.get('contactId');

  const [activeCompanyId, setActiveCompanyId] = useState(urlContactId || 'default');
  const [activeProfile, setActiveProfile] = useState({});

  // Core Data States
  const [tasks, setTasks] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [checklist, setChecklist] = useState(initialChecklist);
  const [isLoading, setIsLoading] = useState(true);

  // HubSpot Native Saved View Tabs
  const [activeTaskTab, setActiveTaskTab] = useState('overdue'); // Overdue default active
  const [activeDealTab, setActiveDealTab] = useState('open'); // Open Deals Only default active

  // Search/Filter values
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('All');
  const [dealSearchTerm, setDealSearchTerm] = useState('');
  const [dealStageFilter, setDealStageFilter] = useState('All');

  // Inline forms
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('High');

  // Dialer banner states
  const [activeDialMessage, setActiveDialMessage] = useState('');

  // ============================================================================
  // DYNAMIC CRM DATA MOUNT (INTEGRATION SERVICE ADAPTER LAYER)
  // ============================================================================
  useEffect(() => {
    const fetchCompanyWorkspaceData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, tasksRes, dealsRes, activitiesRes, meetingsRes] = await Promise.all([
          getCompanyProfile(activeCompanyId),
          getTasks(activeCompanyId),
          getDeals(activeCompanyId),
          getActivities(activeCompanyId),
          getUpcomingMeetings(activeCompanyId)
        ]);

        setActiveProfile(profileRes);
        setTasks(tasksRes);
        setDeals(dealsRes);
        setActivities(activitiesRes);
        setUpcomingMeetings(meetingsRes);
      } catch (err) {
        console.error("HubSpot Extension Sync Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyWorkspaceData();
  }, [activeCompanyId]);

  // Context Switcher trigger — in live mode, re-fetch by contact ID
  const handleSwitchProfileName = (profileName) => {
    // In production, the contact ID comes from URL params; this is kept for dev fallback
    console.log('Profile switch requested for:', profileName);
  };

  // Toggle tasks checkbox complete
  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Advance deal stage dynamically
  const handleAdvanceDealStage = async (id) => {
    const targetDeal = deals.find(d => d.id === id);
    if (!targetDeal) return;

    // Simulate service call stage changes
    const updatedProperties = await updateDealStage(id, targetDeal.stage);
    setDeals(deals.map(deal => 
      deal.id === id ? { ...deal, stage: updatedProperties.stage, probability: updatedProperties.probability } : deal
    ));
  };

  // Toggle checklist check
  const handleToggleChecklist = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Dial out simulation
  const triggerOutboundCall = () => {
    setActiveDialMessage(`Connecting outbound dial via HubSpot softphone to ${activeProfile.contactPerson} (${activeProfile.phone})...`);
    setTimeout(() => {
      setActiveDialMessage('');
      
      const newCallLog = {
        id: Date.now(),
        type: 'Call',
        detail: `Outbound Call Connected: Discussed sample vector sizes and embroidery specs with ${activeProfile.contactPerson}.`,
        time: 'Just now',
        channel: 'HubSpot softphone dialer'
      };
      setActivities([newCallLog, ...activities]);
    }, 4000);
  };

  // Note Pad submit
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now(),
      type: 'Note',
      detail: `Internal Rep Note: "${noteText}"`,
      time: 'Just now',
      channel: 'CRM Note Pad'
    };

    setActivities([newNote, ...activities]);
    setNoteText('');
    setShowNoteForm(false);
  };

  // Task form submit
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      dealer: activeProfile.name,
      dueDate: 'Today',
      urgency: 'Today',
      priority: newTaskPriority,
      type: 'CRM Follow-up',
      completed: false,
      dateBucket: 'Today'
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowTaskForm(false);
  };

  // Task shortcut
  const handleShortcutFollowUp = (title) => {
    setShowNoteForm(true);
    setNoteText(`Action note scheduled regarding: "${title}".`);
  };

  // ============================================================================
  // CRM FILTERING ENGINES
  // ============================================================================

  // Filter Tasks dynamically
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(taskSearchTerm.toLowerCase());
    
    // Saved View Tab Filter Logic
    let matchesTab = true;
    if (activeTaskTab === 'overdue') {
      matchesTab = !task.completed && task.dateBucket === 'Overdue';
    } else if (activeTaskTab === 'active') {
      matchesTab = !task.completed;
    } else if (activeTaskTab === 'upcoming') {
      matchesTab = !task.completed && (task.dateBucket === 'Today' || task.dateBucket === 'Upcoming');
    } else if (activeTaskTab === 'completed') {
      matchesTab = task.completed;
    }

    // Dropdown priority filters
    let matchesPriority = true;
    if (taskPriorityFilter === 'Critical') {
      matchesPriority = task.priority === 'Critical';
    } else if (taskPriorityFilter === 'High') {
      matchesPriority = task.priority === 'High' || task.priority === 'Critical';
    } else if (taskPriorityFilter === 'Medium') {
      matchesPriority = task.priority === 'Medium';
    } else if (taskPriorityFilter === 'Low') {
      matchesPriority = task.priority === 'Low';
    }

    return matchesSearch && matchesTab && matchesPriority;
  });

  // Filter Deals dynamically
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(dealSearchTerm.toLowerCase());

    // Saved View Tab Filter Logic
    let matchesTab = true;
    if (activeDealTab === 'open') {
      matchesTab = deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost';
    } else if (activeDealTab === 'stalled') {
      matchesTab = deal.probability < 50 && deal.stage === 'Negotiation';
    }

    // Dropdown Stage Filters
    let matchesStage = true;
    if (dealStageFilter !== 'All') {
      matchesStage = deal.stage === dealStageFilter;
    }

    return matchesSearch && matchesTab && matchesStage;
  });

  // Sort Deals (Close Date first, then value amount)
  filteredDeals.sort((a, b) => {
    const dateA = new Date(a.closeDate).getTime();
    const dateB = new Date(b.closeDate).getTime();
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    return b.value - a.value;
  });

  // Calculate high priority blocker status metrics
  const overdueCount = tasks.filter(t => !t.completed && t.dateBucket === 'Overdue').length;
  const openDealsCount = deals.filter(d => d.stage !== 'Closed Won').length;
  const stalledDealsCount = deals.filter(d => d.probability < 50 && d.stage === 'Negotiation').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#33475b] font-sans antialiased p-4 xl:p-6 select-text">
      
      {/* Outer Workspace Container (Salesforce + monday.com aesthetics) */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* TOP NAV BAR HEADER */}
        <CRMHeader 
          activeProfile={activeProfile}
          activePipelineValue={activeProfile.totalPipelineValue || 0}
          overdueCount={overdueCount}
          openDealsCount={openDealsCount}
          onSwitchProfile={handleSwitchProfileName}
        />

        {/* Softphone Dialer connected flag banner */}
        {activeDialMessage && (
          <div className="bg-slate-900 text-white px-6 py-2.5 text-xs font-black flex items-center justify-between border-b border-slate-800 shadow-md">
            <span className="flex items-center space-x-2 select-none">
              <IconPhone className="w-4 h-4 text-rose-500 animate-bounce" />
              <span>{activeDialMessage}</span>
            </span>
            <button onClick={() => setActiveDialMessage('')} className="text-slate-400 hover:text-white underline text-[10px] font-bold cursor-pointer">Cancel connection</button>
          </div>
        )}

        <div className="p-4 xl:p-6 space-y-6">

          {/* PRE-CALL SALES STRATEGY SECTION (Brief split cards panel) */}
          <SmartSummary 
            activeProfile={activeProfile} 
            checklist={checklist}
            toggleChecklist={handleToggleChecklist}
          />

          {/* PRIMARY COMMAND ACTION BAR (STICKY ON SCROLL SYSTEM FOR HIGH SAAS UX VELOCITY) */}
          <Toolbar 
            onCall={triggerOutboundCall}
            onLogUpdate={() => { setShowNoteForm(!showNoteForm); setShowTaskForm(false); }}
            onCreateTask={() => { setShowTaskForm(!showTaskForm); setShowNoteForm(false); }}
            onOpenRecord={() => alert(`Opening HubSpot Account Record for ${activeProfile.name}...`)}
          />

          {/* Note Form slide-down */}
          {showNoteForm && (
            <NoteForm 
              noteText={noteText}
              setNoteText={setNoteText}
              onSubmit={handleAddNote}
              onClose={() => setShowNoteForm(false)}
            />
          )}

          {/* Task Form slide-down */}
          {showTaskForm && (
            <TaskForm 
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              onSubmit={handleCreateTask}
              onClose={() => setShowTaskForm(false)}
            />
          )}

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-[#fcfcfc] rounded-xl border border-slate-100 select-none">
              <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin"></div>
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Syncing CRM Extensions Data...</span>
            </div>
          ) : (
            /* CRM WORKSPACE COCKPIT DENSE GRID */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* PRIMARY COLUMN AREA (Left Side Span - 8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* PHASE 2 • TASK EXECUTION WORKSPACE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between select-none">
                    <h2 className="text-[12px] font-black text-[#0a1629] uppercase tracking-widest flex items-center space-x-1.5">
                      <IconAlert className="w-4 h-4 text-rose-500" />
                      <span>PHASE 2 &bull; TASK EXECUTION WORKSPACE</span>
                    </h2>
                    <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider leading-none">
                      {overdueCount} Blockers
                    </span>
                  </div>
                  
                  <TaskTable 
                    tasks={filteredTasks}
                    activeTaskTab={activeTaskTab}
                    setActiveTaskTab={setActiveTaskTab}
                    taskPriorityFilter={taskPriorityFilter}
                    setTaskPriorityFilter={setTaskPriorityFilter}
                    taskSearchTerm={taskSearchTerm}
                    setTaskSearchTerm={setTaskSearchTerm}
                    onToggle={handleToggleTask}
                    onCall={triggerOutboundCall}
                    onFollowUp={handleShortcutFollowUp}
                  />
                </div>

                {/* PHASE 1 • DEAL PRIORITIZATION WORKSPACE */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between select-none">
                    <h2 className="text-[12px] font-black text-[#0a1629] uppercase tracking-widest flex items-center space-x-1.5">
                      <IconCalendar className="w-4 h-4 text-emerald-600" />
                      <span>PHASE 1 &bull; DEAL PRIORITIZATION VIEW</span>
                    </h2>
                    <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider leading-none">
                      Pipeline: ${activeProfile.totalPipelineValue ? activeProfile.totalPipelineValue.toLocaleString() : 0}
                    </span>
                  </div>

                  <DealTable 
                    deals={filteredDeals}
                    activeDealTab={activeDealTab}
                    setActiveDealTab={setActiveDealTab}
                    dealStageFilter={dealStageFilter}
                    setDealStageFilter={setDealStageFilter}
                    dealSearchTerm={dealSearchTerm}
                    setDealSearchTerm={setDealSearchTerm}
                    onAdvance={handleAdvanceDealStage}
                  />
                </div>

              </div>

              {/* SECONDARY SIDEBAR COLUMN - STICKY SCROLL BEHAVIOR FOR SPACE EQUILIBRIUM */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-5">
                
                {/* SMART SALES OPERATIONS RECOMMENDATION */}
                <SmartAIRecommendation overdueCount={overdueCount} />

                {/* DYNAMIC CUSTOMER SNAPSHOT */}
                <CustomerSnapshot profile={activeProfile} />

                {/* CUSTOMER HEALTH INTELLIGENCE Ring SVG gauge */}
                <CustomerHealthCard 
                  healthScore={activeProfile.salesHealth || '100%'}
                  overdueCount={overdueCount}
                  StallCount={stalledDealsCount}
                />

                {/* UPCOMING MEETING CONTEXT */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50 select-none">
                    <h3 className="text-[11px] font-black text-[#0a1629] uppercase tracking-wider flex items-center space-x-1.5">
                      <IconCalendar className="w-4 h-4 text-[#ff7a59]" />
                      <span>UPCOMING MEETING CONTEXT</span>
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-[#ff7a59] animate-pulse"></span>
                  </div>
                  
                  <MeetingPanel meetings={upcomingMeetings} />
                </div>

                {/* SMART CRM ACTIVITY FEED Timeline logs */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50 select-none">
                    <h3 className="text-[11px] font-black text-[#0a1629] uppercase tracking-wider flex items-center space-x-1.5">
                      <IconClock className="w-4 h-4 text-[#0091ae]" />
                      <span>SMART CRM ACTIVITY FEED</span>
                    </h3>
                    <span className="text-[8px] font-black text-[#0091ae] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Interactive
                    </span>
                  </div>

                  <ActivityFeed activities={activities} />
                </div>

              </div>

            </div>
          )}

          {/* HubSpot iFrame Footer */}
          <footer className="p-3 rounded-xl bg-[#f8fafc] text-center border border-slate-200/50 shadow-inner select-none">
            <p className="text-[9px] text-[#64748b] font-black leading-normal uppercase tracking-widest">
              💼 HubSpot CRM Command Center Cockpit &bull; React Extension SDK v2.3 &bull; Rep: sarah.jenkins@athleticknit.com
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}

export default App;
