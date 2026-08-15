import { jsPDF } from 'jspdf'

const PRIMARY = [3, 66, 179]
const DARK = [2, 48, 138]
const LIGHT_BG = [245, 248, 253]
const TEXT_DARK = [15, 23, 42]
const TEXT_MUTED = [100, 116, 139]
const BORDER = [226, 232, 240]

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 16
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

export default function generateReceiptPdf({
  championship,
  formData,
  selectedEvents,
  total,
  receiptNumber,
  registrationNumber,
  bibNumber,
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.setFont('helvetica')

  const getEventName = (id) => {
    const event = championship?.events?.find((e) => e.id === id)
    return event ? event.name : id
  }

  let cursorY = 0

  const ensureSpace = (needed) => {
    if (cursorY + needed > PAGE_HEIGHT - 24) {
      doc.addPage()
      cursorY = MARGIN
    }
  }

  const drawHeader = () => {
    doc.setFillColor(...PRIMARY)
    doc.rect(0, 0, PAGE_WIDTH, 30, 'F')

    doc.setFillColor(...DARK)
    doc.rect(0, 30, PAGE_WIDTH, 1.2, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('RUNRESULT', MARGIN, 13)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Championship Registration Receipt', PAGE_WIDTH - MARGIN, 13, { align: 'right' })

    doc.setFontSize(8)
    doc.text(championship?.name || '', PAGE_WIDTH - MARGIN, 19, { align: 'right' })

    cursorY = 40
  }

  const drawTitle = () => {
    doc.setTextColor(...TEXT_DARK)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('Registration Receipt', MARGIN, cursorY)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXT_MUTED)
    doc.text(`Generated on ${new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}`, PAGE_WIDTH - MARGIN, cursorY, { align: 'right' })

    cursorY += 8
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.3)
    doc.line(MARGIN, cursorY, PAGE_WIDTH - MARGIN, cursorY)
    cursorY += 7
  }

  const sectionHeader = (title) => {
    ensureSpace(18)
    doc.setFillColor(...LIGHT_BG)
    doc.roundedRect(MARGIN, cursorY, CONTENT_WIDTH, 8, 1.5, 1.5, 'F')

    doc.setTextColor(...PRIMARY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.text(title.toUpperCase(), MARGIN + 4, cursorY + 5.6)

    cursorY += 13
  }

  const row = (label, value) => {
    const lines = doc.splitTextToSize(String(value ?? '—'), CONTENT_WIDTH - 95)
    const lineHeight = 5
    const height = Math.max(7, lines.length * lineHeight + 2)

    ensureSpace(height)
    doc.setTextColor(...TEXT_MUTED)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(label, MARGIN + 3, cursorY + 4.5)

    doc.setTextColor(...TEXT_DARK)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(lines, MARGIN + 95, cursorY + 4.5)

    cursorY += height

    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.15)
    doc.line(MARGIN, cursorY - 1.5, PAGE_WIDTH - MARGIN, cursorY - 1.5)
  }

  const spacer = (h = 5) => {
    cursorY += h
  }

  drawHeader()
  drawTitle()

  sectionHeader('Registration Information')
  row('Registration Number', registrationNumber)
  row('Bib Number', bibNumber)
  row('Championship', championship?.name)
  row('Venue', championship?.venue)
  row('Dates', championship?.startDate && championship?.endDate ? `${championship.startDate} — ${championship.endDate}` : '—')
  spacer(4)

  sectionHeader('Athlete Information')
  row('Full Name', formData?.fullName)
  row('Name with Initials', formData?.nameWithInitials)
  row('Gender', formData?.gender)
  row('Date of Birth', formData?.dateOfBirth)
  row('Age Category', formData?.ageCategory)
  row('National ID', formData?.nic)
  row('Email', formData?.email)
  row('Mobile', formData?.mobile)
  row('Institution', formData?.institution)
  row('District', formData?.address?.district)
  spacer(4)

  sectionHeader('Event & Payment Details')
  const eventNames = selectedEvents?.length ? selectedEvents.map(getEventName) : []
  row('Selected Events', eventNames.length ? eventNames.join(', ') : '—')
  row('Total Fee', `Rs. ${Number(total || 0).toLocaleString()}`)
  row('Payment Method', 'Cash Deposit')
  row('Receipt Number', receiptNumber)
  spacer(6)

  const footerTop = PAGE_HEIGHT - 22
  doc.setFillColor(...PRIMARY)
  doc.rect(0, footerTop, PAGE_WIDTH, 22, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('RunResult', MARGIN, footerTop + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text(
    'This is a computer generated receipt for your championship registration. Keep this document safe.',
    MARGIN,
    footerTop + 13
  )
  doc.text(
    'Please quote your Registration Number for all correspondence with the organizers.',
    MARGIN,
    footerTop + 17
  )

  doc.save(`Registration-Receipt-${registrationNumber || bibNumber || 'Receipt'}.pdf`)
}
