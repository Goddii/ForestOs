import Badge from './ui/Badge'

/**
 * Small "DEMO DATA" pill — dropped next to any figure sourced from the
 * investor demo data layer, so nothing in this prototype reads as a real
 * ForestOS result. See src/data/investor/index.js (`IS_DEMO_ENVIRONMENT`).
 *
 * @param {{ className?: string }} props
 */
export default function DemoBadge({ className = '' }) {
  return (
    <Badge tone="warning" className={className}>
      Demo data
    </Badge>
  )
}
