// DEMO DATA — the configurable intervention catalogue (audit §7, §12 rule 2).
// Types follow the buffer-belt interventions NTZDC has historically run (tea,
// fuelwood, indigenous trees, livelihoods — audit §2.2), not only "trees".
// `requiredEvidence` is what a reviewer needs before an activity of this type
// can be verified; `survivalChecksMonths` schedules follow-up counts.

export const INTERVENTION_TYPES = [
  { id: 'it-tea-infill', label: 'Tea infilling of buffer gaps', category: 'tea', requiredEvidence: ['GPS polygon', 'Photo set'], survivalChecksMonths: [3, 12] },
  { id: 'it-fuelwood', label: 'Fuelwood plantation', category: 'trees', requiredEvidence: ['GPS polygon', 'Photo set', 'Seedling tally'], survivalChecksMonths: [3, 12] },
  { id: 'it-indigenous', label: 'Indigenous tree planting', category: 'trees', requiredEvidence: ['GPS polygon', 'Photo set', 'Species tally'], survivalChecksMonths: [3, 12, 24] },
  { id: 'it-site-prep', label: 'Site preparation', category: 'trees', requiredEvidence: ['Photo set'], survivalChecksMonths: [] },
  { id: 'it-apiary', label: 'Apiary installation with training', category: 'livelihood', requiredEvidence: ['Signed group register', 'Hive GPS points'], survivalChecksMonths: [] },
  { id: 'it-onboarding', label: 'Farmer onboarding and plot mapping', category: 'protection', requiredEvidence: ['Participant register', 'Plot GPS capture'], survivalChecksMonths: [] },
  { id: 'it-patrol', label: 'Buffer patrol', category: 'protection', requiredEvidence: ['GPS track'], survivalChecksMonths: [] },
  { id: 'it-audit', label: 'Buffer compliance audit', category: 'protection', requiredEvidence: ['Audit checklist'], survivalChecksMonths: [] },
  { id: 'it-disturbance', label: 'Disturbance response', category: 'protection', requiredEvidence: ['Field visit report'], survivalChecksMonths: [] },
  { id: 'it-boundary', label: 'Boundary survey', category: 'monitoring', requiredEvidence: ['Survey file'], survivalChecksMonths: [] },
]

export function getInterventionType(id) {
  return INTERVENTION_TYPES.find((type) => type.id === id) ?? null
}
