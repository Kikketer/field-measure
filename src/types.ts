export type Field = {
  id: string
  createdAt: Date
  size: string
  customWidth?: number
  customLength?: number
  code: string
  name: string
  description: string
  degradeFactor: number
  /**
   * Total rainfall since the last painting
   */
  rainfallTotal: number
  lastPainted: Date
  /**
   * As determined by the painting team, this helps us "learn" the degrade_factor
   */
  playable: boolean
  archived: boolean
  /**
   * If 1 = we really need to paint the field
   */
  paintFactor: number
  sortOrder: number
}

export enum FieldSize {
  full = 'Full',
  elevenThirteen = '11/13',
  nineTen = '9/10',
  sevenEight = '7/8',
}
