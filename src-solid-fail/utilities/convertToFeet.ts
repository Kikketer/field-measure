export const convertToFeet = (lengthInFeet: number): string => {
  // Convert any number into feet and inches string:
  const feet = Math.floor(lengthInFeet)
  const inches = Math.round((lengthInFeet - feet) * 12)

  // Edge case where we round to 12 inches, simply add another foot and set to 0 inches:
  if (inches === 12) {
    return `${feet + 1}'`
  }

  if (inches === 0) {
    return `${feet}'`
  }
  return `${feet}' ${inches}"`
}
