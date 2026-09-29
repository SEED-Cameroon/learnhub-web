const xaf = new Intl.NumberFormat('en-CM', { maximumFractionDigits: 0 })

/** 2500 -> "2,500 XAF"; 0 -> "Free" when `free` is set. */
export function formatXaf(amount, { free = false } = {}) {
  if (free && !amount) return 'Free'
  return `${xaf.format(amount)} XAF`
}

/** 12400 -> "12.4k" */
export function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/** "2026-09-28" -> "28 Sep 2026" */
export function formatDate(value) {
  return value ? dateFormat.format(new Date(value)) : '—'
}

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** ISO timestamp -> "3 days ago" */
export function formatRelative(value) {
  const seconds = (new Date(value).getTime() - Date.now()) / 1000
  const units = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export function totalMinutes(lessons = []) {
  return lessons.reduce((sum, l) => sum + (l.durationMin ?? 0), 0)
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h} h ${m} min` : `${m} min`
}
