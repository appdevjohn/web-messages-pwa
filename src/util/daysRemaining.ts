export default function getDaysRemaining(
  nowDate: Date,
  futureDate: Date
): number {
  const millisecondsBetween =
    new Date(futureDate).getTime() - new Date(nowDate).getTime()
  if (millisecondsBetween < 0) {
    return 0
  } else {
    return Math.round(millisecondsBetween / (24 * 60 * 60 * 1000))
  }
}
