export type Field = {
  id?: string
  createdAt?: Date
  size: string
  customWidth?: number
  customLength?: number
  name: string
  group?: string
  description?: string
  /**
   * The number of days a typical field will need to be repainted
   * regardless of rainfall
   */
  maxDryDays: number
  /**
   * Number of days that had significant rain since the last painting
   */
  rainfallDays: number
  /**
   * The effect that a day of rain has on the field
   * 1 = 1 day of rainfall = 1 less day of playable field
   * This number is adjusted when we click the "Unplayable" button UNLESS there hasn't been any rainfall
   */
  rainfallFactor: number
  lastPainted: Date
  predictedNextPaint?: Date
  /**
   * The date the field was marked unplayable
   * This allows us to determine what the maxDryDays should be
   */
  markedUnplayable: Date
  sortOrder: number
  paintTeamId: number
  active?: boolean
  modified?: Date
  deleted?: boolean
}

export enum FieldSize {
  full = 'Full',
  elevenThirteen = '11/13',
  nineTen = '9/10',
  sevenEight = '7/8',
}
