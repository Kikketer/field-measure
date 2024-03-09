export type PaintTeam = {
  id: string
  name: string
  zipcode?: string
}

export type Weather = {
  precipitation: {
    total: number
  }
}

export type DBField = {
  id: string
  created_at?: string //Date
  size: string
  custom_width?: number
  custom_length?: number
  code: string
  name: string
  group?: string
  description?: string
  /**
   * The number of days a typical field will need to be repainted
   * regardless of rainfall
   */
  max_dry_days: number
  /**
   * The number of rainfall days for the previous period
   */
  previous_rainfall_days: number
  /**
   * Number of days that had significant rain since the last painting
   */
  rainfall_days: number
  /**
   * The effect that a day of rain has on the field
   * 1 = 1 day of rainfall = 1 less day of playable field
   * This number is adjusted when we click the "Unplayable" button UNLESS there hasn't been any rainfall
   */
  rainfall_factor: number
  last_painted: string // Date
  predicted_next_paint?: string // Date
  /**
   * Predicted amount of days until it needs to be painted again
   * <=0 = needs to be painted
   */
  should_paint: number
  /**
   * The date the field was marked unplayable
   * This allows us to determine what the maxDryDays should be
   */
  marked_unplayable: string // Date
  sort_order: number
  paint_team_id: number
  active?: boolean
  modified?: string // Date
  deleted?: boolean
}
