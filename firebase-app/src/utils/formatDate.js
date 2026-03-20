export function formatTaskDate(createdAt) {
  if (!createdAt) return '—'
  const d =
    typeof createdAt.toDate === 'function'
      ? createdAt.toDate()
      : createdAt.seconds
        ? new Date(createdAt.seconds * 1000)
        : new Date(createdAt)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
