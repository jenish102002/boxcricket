import clsx from 'clsx'

export function Badge({ status }) {
  const map = {
    AVAILABLE: 'badge-available',
    BOOKED: 'badge-booked',
    BLOCKED: 'badge-blocked',
    CONFIRMED: 'badge-confirmed',
    CANCELLED: 'badge-cancelled',
    ADMIN: 'badge-available',
    USER: 'badge-booked',
  }
  return (
    <span className={map[status] || 'badge-booked'}>
      {status}
    </span>
  )
}
