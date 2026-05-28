// ============================================================================
// ATHLETIC KNIT REVENUE OPERATIONS PORTAL • MOCK DATABASE LAYER
// ============================================================================

export const profileApexHockey = {
  id: 'company_apex_101',
  name: 'Apex Hockey Distributors',
  industry: 'Sports Apparel Dealer',
  owner: 'Sarah Jenkins',
  totalPipelineValue: 22700,
  contactPerson: 'Mike Ross',
  phone: '+1 (555) 382-9402',
  lastInteraction: '2 hours ago',
  riskStatus: 'Artwork Pending',
  salesHealth: '84%',
  quickPitchHook: "Mike Ross is waiting for high-resolution vector logos. Today's Zoom call must confirm chest embroidery dimensions and custom collar designs to release the 500x order before next week's production window closes."
};

export const profileEliteSports = {
  id: 'company_elite_202',
  name: 'Elite Sports Apparel',
  industry: 'Varsity Jacket Dealer',
  owner: 'Sarah Jenkins',
  totalPipelineValue: 9600,
  contactPerson: 'Brenda Patel',
  phone: '+1 (555) 293-8401',
  lastInteraction: 'Yesterday',
  riskStatus: 'Stable',
  salesHealth: '96%',
  quickPitchHook: "Elite Sports is currently inspecting custom varsity jacket samples. Today's call must verify physical swatch colors, finalize wrist ribbing specifications, and obtain the wholesale billing sign-off."
};

export const initialTasks = [
  // Overdue
  { id: 1, title: 'Confirm Apex Hockey sublimated neck specifications', dealer: 'Apex Hockey Distributors', dueDate: 'May 23, 2026', urgency: '3 days overdue', priority: 'High', type: 'Art Approval', completed: false, dateBucket: 'Overdue' },
  { id: 2, title: 'Call Mike Ross regarding embroidery thread alignment', dealer: 'Apex Hockey Distributors', dueDate: 'May 21, 2026', urgency: '5 days overdue', priority: 'Critical', type: 'Production Spec', completed: false, dateBucket: 'Overdue' },
  // Today
  { id: 3, title: 'Verify custom varsity jacket swatch receipt', dealer: 'Elite Sports Apparel', dueDate: 'Today', urgency: 'Today', priority: 'Medium', type: 'Samples', completed: false, dateBucket: 'Today' },
  // Upcoming
  { id: 4, title: 'Audit billing price sheets in ledger system', dealer: 'Elite Sports Apparel', dueDate: 'Tomorrow', urgency: 'Upcoming', priority: 'Low', type: 'Billing', completed: false, dateBucket: 'Upcoming' }
];

export const initialDeals = [
  { id: 1, name: 'Apex Hockey - 500x Custom Sublimated Uniforms', dealer: 'Apex Hockey Distributors', value: 18500, stage: 'Proof Approved', probability: 80, closeDate: 'June 15, 2026', priority: 'Critical' },
  { id: 2, name: 'Elite Varsity Club - 120x Embroidered Jackets', dealer: 'Elite Sports Apparel', value: 9600, stage: 'Quote Sent', probability: 50, closeDate: 'June 28, 2026', priority: 'Normal' },
  { id: 3, name: 'Apex Hockey - 150x Custom Athletic Knit Socks', dealer: 'Apex Hockey Distributors', value: 4200, stage: 'Negotiation', probability: 30, closeDate: 'July 05, 2026', priority: 'Normal' }
];

export const initialActivities = [
  { id: 1, type: 'Call', detail: 'Connected outbound dial: Discussed jersey collar measurements and wholesale pricing parameters.', time: '2h ago', channel: 'HubSpot Softphone' },
  { id: 2, type: 'Email', detail: 'Received inbound vector from Mike: "Here are final logo outlines in vector AI structure."', time: '1d ago', channel: 'Inbound GSuite Email' },
  { id: 3, type: 'Meeting', detail: 'Completed sizing sample review with dealer rep Brenda Patel inside showroom floor.', time: '2d ago', channel: 'In-Person Showroom' },
  { id: 4, type: 'System', detail: 'Advanced Deal stage: Stage advanced from negotiation to Quote Sent automatically.', time: '3d ago', channel: 'CRM Workflow Engine' }
];

export const meetingsApex = [
  { id: 1, title: 'Apex Hockey - Art Sign-off & Production Review', time: 'Today at 2:00 PM (in 1 hour)', duration: '30 mins', location: 'Zoom Video Link', active: true, keyAttendee: 'Mike Ross' }
];

export const meetingsElite = [
  { id: 2, title: 'Elite Sports - Varsity Jacket Swatch Review', time: 'Tomorrow at 10:00 AM', duration: '45 mins', location: 'Showroom Floor', active: true, keyAttendee: 'Brenda Patel' }
];

export const initialChecklist = [
  { id: 1, label: 'Review vector logo outlines (.AI formats)', checked: false },
  { id: 2, label: 'Verify collar fabric size specifications', checked: true },
  { id: 3, label: 'Cross check ledger wholesale pricing sheets', checked: false }
];
