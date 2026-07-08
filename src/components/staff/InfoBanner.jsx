import { Info } from 'lucide-react'

export default function InfoBanner() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-blue-50/80 border border-blue-100 rounded-xl">
      <Info size={16} className="text-primary shrink-0 mt-0.5" />
      <div className="text-xs sm:text-sm text-[#0F172A]">
        <p>Changes are saved directly to the official RUNRESULT Google Spreadsheet.</p>
        <p className="text-[#64748B] mt-0.5">This workspace is for editing only. Downloading, exporting, saving as file, and printing are restricted.</p>
      </div>
    </div>
  )
}
