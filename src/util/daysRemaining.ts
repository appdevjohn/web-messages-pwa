export default function getDaysRemaining(date1: Date, date2: Date): number {
  const millisecondsBetween = Math.abs(
    new Date(date2).getTime() - new Date(date1).getTime()
  )
  return Math.round(millisecondsBetween / (24 * 60 * 60 * 1000))
}
