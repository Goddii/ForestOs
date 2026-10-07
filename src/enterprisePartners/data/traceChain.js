/** Tea traceability chain — illustrative structure aligned to ForestOS records. */

export const TRACE_STEPS = [
  { id: 'land', label: 'Land', hint: 'Where conservation takes place' },
  { id: 'block', label: 'Block', hint: 'Forest / conservation block' },
  { id: 'plot', label: 'Plot', hint: 'Verified geographical area' },
  { id: 'harvest', label: 'Harvest', hint: 'Tea harvest record' },
  { id: 'batch', label: 'Batch', hint: 'Specific tea batch' },
  { id: 'processing', label: 'Processing', hint: 'Factory / processing stage' },
  { id: 'verification', label: 'Verification', hint: 'Field + satellite verification' },
  { id: 'impact', label: 'Conservation impact', hint: 'Environmental contribution' },
]

export const ILLUSTRATIVE_IMPACT = {
  hectaresProtected: { value: 3.2, label: 'Hectares protected', note: 'ILLUSTRATIVE' },
  batchesVerified: { value: 1284, label: 'Tea batches verified', note: 'ILLUSTRATIVE' },
  restorationActions: { value: 47, label: 'Restoration actions', note: 'ILLUSTRATIVE' },
  communityImpact: { value: 1240, label: 'Community pluckers linked', note: 'ILLUSTRATIVE' },
}
