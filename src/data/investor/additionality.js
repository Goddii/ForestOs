// DEMO DATA — illustrative only. Two conceptual scenarios, not a claimed
// causal result — see build brief §17. Language stays to "expected pathway"
// / "monitored change", never "caused" or "proven".

export const ADDITIONALITY_SCENARIOS = {
  without: {
    label: 'Without intervention',
    sublabel: 'Baseline / business-as-usual',
    points: [
      'Buffer-belt encroachment continues at the pre-programme rate observed in 2023–2024 baseline surveys.',
      'No structured incentive links farmer income to conservation outcomes on their own plots.',
      'Conservation activity is not independently verified or evidenced at plot level.',
    ],
  },
  with: {
    label: 'With intervention',
    sublabel: 'Expected intervention pathway',
    points: [
      'Buffer-belt boundary is surveyed, monitored by satellite, and re-verified in the field on any change.',
      'Farmer participation is incentive-linked to verified conservation compliance on their own plots.',
      'Every conservation claim carries a linked evidence record — satellite, GPS, field audit or photo.',
    ],
  },
  note: 'This comparison describes the intervention model this programme is designed around, not a measured counterfactual — ForestOS does not yet run a formal baseline-vs-treatment causal study on this project. Treat it as the intended contribution, not a proven outcome.',
}
