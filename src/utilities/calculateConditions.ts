import { Field } from './types'

export const predictNextPaintDate = () => {}

export const adjustRainFactorAndDryDays = ({
  currentField,
}: {
  currentField: Field
}): Field => {
  /**
   * Max days with no rainfall = 14
   * If unplayable and rainfall has happened, adjust the rainfall factor to match the duration since last painting
   * If unplayable is flagged before that with no rainfall, reduce that number
   *  - but also look at the previous time period and adjust the rainfactor to account for this new number
   */

  return {}
}
