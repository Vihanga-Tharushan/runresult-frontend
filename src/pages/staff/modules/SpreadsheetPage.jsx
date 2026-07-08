import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import StaffHeader from '../../../components/staff/StaffHeader'
import ChampionshipSelector from '../../../components/staff/ChampionshipSelector'
import SpreadsheetWorkspace from '../../../components/staff/SpreadsheetWorkspace'
import EmptyState from '../../../components/staff/EmptyState'
import { adminChampionships } from '../../../data/adminData'

const pageConfig = {
  'registered-users': { sheetKey: 'registration', header: { title: 'Registered Users', desc: 'Manage athlete registration data for the selected championship.' } },
  'start-list': { sheetKey: 'startList', header: { title: 'Start List', desc: 'Arrange lane assignments and athlete positions for events.' } },
  'heat-results': { sheetKey: 'heatResults', header: { title: 'Heat Results', desc: 'Enter performances, timings, and qualification status for heats.' } },
  'final-results': { sheetKey: 'finalResults', header: { title: 'Final Results', desc: 'Edit final rankings, medals, records, and performance values.' } },
}

export default function SpreadsheetPage({ pageKey }) {
  const [selectedId, setSelectedId] = useState(null)
  const config = pageConfig[pageKey]
  const header = config?.header || {}

  const selectedChamp = useMemo(
    () => adminChampionships.find(c => c.id === selectedId),
    [selectedId]
  )

  const sheetUrl = selectedChamp?.googleSheets?.[config?.sheetKey]?.url || ''

  return (
    <div className="space-y-6">
      <StaffHeader title={header.title} description={header.desc} />

      <div className="max-w-lg">
        <ChampionshipSelector
          championships={adminChampionships}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {!selectedId ? (
        <EmptyState
          title="Select a Championship"
          description="Please select a championship above to load its spreadsheet."
          action={
            <button
              onClick={() => document.querySelector('button')?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all"
            >
              <ChevronDown size={16} /> Select Championship
            </button>
          }
        />
      ) : (
        <SpreadsheetWorkspace
          sheetUrl={sheetUrl}
          championshipName={selectedChamp?.name}
        />
      )}
    </div>
  )
}
