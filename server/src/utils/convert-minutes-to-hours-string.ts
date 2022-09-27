export function convertMinutesToHoursString(minutes: number) {
  const hours = Math.floor(minutes / 60)
  let restOfMinutes = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(restOfMinutes).padStart(2, '0')}`
}