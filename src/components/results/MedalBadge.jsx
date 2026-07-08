const medalConfig = {
  Gold: { label: 'Gold', emoji: '🥇', color: 'text-yellow-500' },
  Silver: { label: 'Silver', emoji: '🥈', color: 'text-gray-400' },
  Bronze: { label: 'Bronze', emoji: '🥉', color: 'text-amber-700' },
}

export default function MedalBadge({ type, showLabel = false }) {
  const config = medalConfig[type]
  if (!config) return null

  return (
    <span className={`inline-flex items-center gap-1 font-bold text-sm ${config.color}`}>
      <span className="text-base leading-none">{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
