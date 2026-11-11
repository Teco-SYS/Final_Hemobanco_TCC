export function maskCpf(value) {
  let v = String(value || '').replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
  if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
  return v
}

export function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  if (String(dateStr).includes('/')) return dateStr
  const [y, m, d] = String(dateStr).split('-')
  if (!y || !m || !d) return dateStr
  return `${d}/${m}/${y}`
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function gerarProtocolo() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 90000) + 10000)
  return `HB-${y}${m}${day}-${rand}`
}
