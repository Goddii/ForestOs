// DEMO DATA — survival checks (see lib/programme/survival.js). Scheduled per
// planting activity from its intervention type's `survivalChecksMonths`.
// Counts are recorded, never a typed-in percentage; a check that hasn't
// happened has no value. One check is deliberately overdue, so the workspace
// shows follow-up gaps rather than hiding them.

export const SURVIVAL_OBSERVATIONS = [
  { id: 'obs-a01-3', activityId: 'act-a-01', monthsAfter: 3, dueDate: '2026-07-08', observedDate: '2026-07-10', planted: 145_000, surviving: 131_950, method: 'Plant count on 20 random 10 m transects, scaled to the polygon', evidenceId: 'ev-019' },
  { id: 'obs-a02-3', activityId: 'act-a-02', monthsAfter: 3, dueDate: '2026-07-20', observedDate: '2026-07-22', planted: 19_800, surviving: 17_030, method: 'Full count along planting lines', evidenceId: 'ev-019' },
  { id: 'obs-a04-3', activityId: 'act-a-04', monthsAfter: 3, dueDate: '2026-09-03', observedDate: null, planted: null, surviving: null, method: 'Full count along planting lines', evidenceId: null },
  { id: 'obs-b06-3', activityId: 'act-b-06', monthsAfter: 3, dueDate: '2026-11-30', observedDate: null, planted: null, surviving: null, method: 'Tagged-seedling count', evidenceId: null },
  { id: 'obs-a01-12', activityId: 'act-a-01', monthsAfter: 12, dueDate: '2027-04-08', observedDate: null, planted: null, surviving: null, method: 'Plant count on transects', evidenceId: null },
  { id: 'obs-a02-12', activityId: 'act-a-02', monthsAfter: 12, dueDate: '2027-04-20', observedDate: null, planted: null, surviving: null, method: 'Full count along planting lines', evidenceId: null },
  { id: 'obs-a04-12', activityId: 'act-a-04', monthsAfter: 12, dueDate: '2027-06-03', observedDate: null, planted: null, surviving: null, method: 'Full count along planting lines', evidenceId: null },
]
