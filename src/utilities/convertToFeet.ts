export const convertToFeet = (lengthInFeet: number): string => {
  // Convert any number into feet and inches string:
  const feet = Math.floor(lengthInFeet)
  const inches = Math.round((lengthInFeet - feet) * 12)

  if (inches === 0) {
    return `${feet}'`
  }
  return `${feet}' ${inches}"`
}
