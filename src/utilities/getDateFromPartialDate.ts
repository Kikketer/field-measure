export const getDateFromPartialDate = (
  dateWithoutTime?: string | null,
): Date | undefined => {
  // We will convert the YYYY-MM-DD string to a Date object with the current time on it
  if (!dateWithoutTime) {
    return
  }

  // If the dateWithoutTime has a T, then just return that
  if (dateWithoutTime.includes('T')) {
    return new Date(dateWithoutTime)
  }

  // Throw an error if the dateWithoutTime can't be parsed as a date
  if (isNaN(Date.parse(dateWithoutTime))) {
    throw new Error('Invalid date string')
  }

  // Get the current time
  const now = new Date()
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  const currentSeconds = now.getSeconds()

  // Format the current time as a string in the format "HH:MM:SS"
  const currentTimeString = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`

  // Combine the date input with the current time string
  const dateTimeString = `${dateWithoutTime}T${currentTimeString}`

  return new Date(dateTimeString)
}
