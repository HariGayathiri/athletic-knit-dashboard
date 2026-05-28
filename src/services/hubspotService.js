// ============================================================================
// ATHLETIC KNIT REVENUE OPERATIONS PORTAL • LIVE HUBSPOT API SERVICE LAYER
// ============================================================================
// All API calls go through the Netlify serverless proxy (/.netlify/functions/hubspot)
// to bypass CORS restrictions. The proxy calls HubSpot server-side securely.
// ============================================================================

// All requests go through the Netlify serverless proxy (bypasses CORS)
const PROXY = '/.netlify/functions/hubspot';

/**
 * Calls the Netlify proxy, which calls HubSpot API server-side
 */
const hsGet = async (path) => {
  const res = await fetch(`${PROXY}?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`HubSpot API error: ${res.status} for ${path}`);
  return res.json();
};

const hsPost = async (path, body) => {
  const res = await fetch(`${PROXY}?path=${encodeURIComponent(path)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HubSpot API error: ${res.status} for ${path}`);
  return res.json();
};

// ============================================================================
// CONTACT PROFILE — Fetches real contact + associated company from HubSpot CRM
// ============================================================================
export const getCompanyProfile = async (contactId) => {
  if (!contactId || contactId === 'default') {
    return {
      id: null,
      name: 'Select a Contact',
      contactPerson: 'Open from HubSpot CRM',
      email: '—', phone: '—', role: '—', status: 'N/A',
      salesHealth: '0%', artworkStatus: '—', totalPipelineValue: 0,
      briefingNote: 'Open this dashboard from a Contact record in HubSpot CRM to load live data.',
    };
  }

  try {
    // Fetch contact properties
    const contact = await hsGet(
      `/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,phone,company,jobtitle,hs_lead_status,notes_last_contacted`
    );
    const props = contact.properties || {};

    // Fetch associated companies
    let companyName = props.company || 'Unknown Company';
    let totalPipelineValue = 0;

    try {
      const assoc = await hsGet(`/crm/v3/objects/contacts/${contactId}/associations/companies`);
      const companyId = assoc?.results?.[0]?.id;
      if (companyId) {
        const comp = await hsGet(
          `/crm/v3/objects/companies/${companyId}?properties=name,annualrevenue,industry`
        );
        companyName = comp.properties?.name || companyName;
        totalPipelineValue = parseFloat(comp.properties?.annualrevenue || '0');
      }
    } catch (_) { /* Company association optional */ }

    const fullName = `${props.firstname || ''} ${props.lastname || ''}`.trim() || 'Unknown Contact';
    const lastContacted = props.notes_last_contacted
      ? new Date(props.notes_last_contacted).toLocaleDateString()
      : 'N/A';

    return {
      id: contactId,
      name: companyName,
      contactPerson: fullName,
      email: props.email || '—',
      phone: props.phone || '—',
      role: props.jobtitle || 'Contact',
      status: props.hs_lead_status || 'Active',
      salesHealth: '85%',
      artworkStatus: 'Pending Review',
      totalPipelineValue,
      briefingNote: `${fullName} at ${companyName}. Last contacted: ${lastContacted}. Review open deals and tasks before the call.`,
    };
  } catch (err) {
    console.error('Contact API Error:', err);
    return {
      id: contactId, name: 'Error Loading Contact', contactPerson: '—',
      email: '—', phone: '—', role: '—', status: 'Error',
      salesHealth: '0%', artworkStatus: '—', totalPipelineValue: 0,
      briefingNote: 'Failed to load contact data. Please check your HubSpot Private App token scopes.',
    };
  }
};

// ============================================================================
// TASKS — Fetches real tasks associated with this contact
// ============================================================================
export const getTasks = async (contactId) => {
  if (!contactId || contactId === 'default') return [];
  try {
    const assoc = await hsGet(`/crm/v3/objects/contacts/${contactId}/associations/tasks`);
    const taskIds = (assoc?.results || []).map(t => t.id);
    if (taskIds.length === 0) return [];

    const taskData = await hsPost('/crm/v3/objects/tasks/batch/read', {
      inputs: taskIds.map(id => ({ id })),
      properties: ['hs_task_subject', 'hs_task_status', 'hs_task_priority', 'hs_timestamp', 'hs_task_type'],
    });

    const now = new Date();
    return (taskData?.results || []).map(task => {
      const props = task.properties || {};
      const dueDate = props.hs_timestamp ? new Date(props.hs_timestamp) : null;
      const isCompleted = props.hs_task_status === 'COMPLETED';

      let dateBucket = 'Upcoming';
      if (dueDate) {
        const diff = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
        if (diff < 0) dateBucket = 'Overdue';
        else if (diff === 0) dateBucket = 'Today';
      }

      const priorityMap = { HIGH: 'High', LOW: 'Low', MEDIUM: 'Medium' };
      const priority = priorityMap[props.hs_task_priority] || 'Medium';

      return {
        id: task.id,
        title: props.hs_task_subject || 'Untitled Task',
        dealer: '',
        dueDate: dueDate ? dueDate.toLocaleDateString() : 'No Due Date',
        urgency: dateBucket,
        priority,
        type: props.hs_task_type || 'TODO',
        completed: isCompleted,
        dateBucket,
      };
    });
  } catch (err) {
    console.error('Tasks API Error:', err);
    return [];
  }
};

// ============================================================================
// DEALS — Fetches real deals associated with this contact
// ============================================================================
export const getDeals = async (contactId) => {
  if (!contactId || contactId === 'default') return [];
  try {
    const assoc = await hsGet(`/crm/v3/objects/contacts/${contactId}/associations/deals`);
    const dealIds = (assoc?.results || []).map(d => d.id);
    if (dealIds.length === 0) return [];

    const dealData = await hsPost('/crm/v3/objects/deals/batch/read', {
      inputs: dealIds.map(id => ({ id })),
      properties: ['dealname', 'amount', 'dealstage', 'closedate', 'hs_deal_stage_probability'],
    });

    const stageMap = {
      appointmentscheduled: 'Quote Sent',
      qualifiedtobuy: 'Negotiation',
      presentationscheduled: 'Proof Approved',
      decisionmakerboughtin: 'Deposit Received',
      contractsent: 'Quote Sent',
      closedwon: 'Closed Won',
      closedlost: 'Closed Lost',
    };

    return (dealData?.results || []).map(deal => {
      const props = deal.properties || {};
      const probability = Math.round(parseFloat(props.hs_deal_stage_probability || '0') * 100);
      const stage = stageMap[props.dealstage] || props.dealstage || 'Negotiation';
      return {
        id: deal.id,
        name: props.dealname || 'Unnamed Deal',
        dealer: '',
        value: parseFloat(props.amount || '0'),
        stage,
        probability,
        closeDate: props.closedate || new Date().toISOString().split('T')[0],
        product: 'Athletic Gear',
        units: '—',
      };
    });
  } catch (err) {
    console.error('Deals API Error:', err);
    return [];
  }
};

// ============================================================================
// ACTIVITIES — Fetches real engagement timeline
// ============================================================================
export const getActivities = async (contactId) => {
  if (!contactId || contactId === 'default') return [];
  try {
    const data = await hsGet(
      `/engagements/v1/engagements/associated/contact/${contactId}/paged?limit=10`
    );
    return (data?.results || []).map(eng => {
      const type = eng.engagement?.type || 'NOTE';
      const timestamp = eng.engagement?.createdAt
        ? new Date(eng.engagement.createdAt).toLocaleDateString() : 'Recent';
      const body = eng.metadata?.body || eng.metadata?.subject || eng.metadata?.title || `${type} logged`;
      const typeMap = { NOTE: 'Note', EMAIL: 'Email', CALL: 'Call', MEETING: 'Meeting', TASK: 'Task' };
      return {
        id: eng.engagement?.id || Math.random(),
        type: typeMap[type] || type,
        detail: body.replace(/<[^>]+>/g, '').substring(0, 120),
        time: timestamp,
        channel: 'HubSpot CRM',
      };
    });
  } catch (err) {
    console.error('Activities API Error:', err);
    return [];
  }
};

// ============================================================================
// MEETINGS — Fetches upcoming meetings for the contact
// ============================================================================
export const getUpcomingMeetings = async (contactId) => {
  if (!contactId || contactId === 'default') return [];
  try {
    const data = await hsGet(
      `/engagements/v1/engagements/associated/contact/${contactId}/paged?limit=10`
    );
    return (data?.results || [])
      .filter(e => e.engagement?.type === 'MEETING')
      .map(m => ({
        id: m.engagement?.id,
        title: m.metadata?.title || 'Meeting',
        date: m.metadata?.startTime
          ? new Date(m.metadata.startTime).toLocaleDateString() : 'TBD',
        time: m.metadata?.startTime
          ? new Date(m.metadata.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
        agenda: m.metadata?.body || 'No agenda set.',
      }));
  } catch (err) {
    console.error('Meetings API Error:', err);
    return [];
  }
};

// ============================================================================
// UPDATE DEAL STAGE — Writes stage update back to HubSpot via proxy
// ============================================================================
export const updateDealStage = async (dealId, currentStage) => {
  const stageProgressionMap = {
    'Negotiation':       { stage: 'Quote Sent',       probability: 50 },
    'Quote Sent':        { stage: 'Proof Approved',    probability: 80 },
    'Proof Approved':    { stage: 'Deposit Received',  probability: 100 },
    'Deposit Received':  { stage: 'Negotiation',       probability: 30 },
  };
  const next = stageProgressionMap[currentStage] || { stage: currentStage, probability: 50 };
  const hubspotStageMap = {
    'Quote Sent': 'appointmentscheduled',
    'Negotiation': 'qualifiedtobuy',
    'Proof Approved': 'presentationscheduled',
    'Deposit Received': 'decisionmakerboughtin',
  };

  try {
    await hsPost(`/crm/v3/objects/deals/${dealId}`, {
      properties: { dealstage: hubspotStageMap[next.stage] || 'qualifiedtobuy' },
    });
  } catch (err) {
    console.error('Deal Update Error:', err);
  }
  return { id: dealId, stage: next.stage, probability: next.probability };
};
