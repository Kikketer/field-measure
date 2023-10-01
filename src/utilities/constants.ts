import { FieldSize } from './types'

export type FieldDimensions = {
  // Lengths and Widths:
  minWidth: number
  maxWidth: number
  recommendedMinWidth: number
  recommendedMaxWidth: number
  minLength: number
  maxLength: number
  recommendedMinLength: number
  recommendedMaxLength: number
  // Boxes:
  goalBoxDepth: number
  goalBoxWidth: number
  penaltyBoxDepth?: number
  penaltyBoxWidth?: number
  // Spots:
  penaltyKickSpot: number
  arcFromKickSpot?: number
  // Circles:
  hasArc: boolean
  circleRadius: number
  // Goals:
  goalWidth: number
}

export const SIZES: { [T: string]: FieldDimensions } = {
  [FieldSize.full]: {
    // Lengths and Widths:
    minWidth: 150,
    maxWidth: 300,
    recommendedMinWidth: 210,
    recommendedMaxWidth: 240,
    minLength: 300,
    maxLength: 360,
    recommendedMinLength: 330,
    recommendedMaxLength: 345,
    // Boxes:
    goalBoxDepth: 18,
    goalBoxWidth: 66,
    penaltyBoxDepth: 54,
    penaltyBoxWidth: 132,
    // Spots:
    penaltyKickSpot: 36,
    arcFromKickSpot: 30,
    // Circles:
    hasArc: true,
    circleRadius: 30,
    // Goals:
    goalWidth: 24,
  },
  [FieldSize.elevenThirteen]: {
    // Lengths and Widths:
    minWidth: 135,
    maxWidth: 165,
    recommendedMinWidth: 135,
    recommendedMaxWidth: 165,
    minLength: 210,
    maxLength: 240,
    recommendedMinLength: 210,
    recommendedMaxLength: 240,
    // Boxes:
    goalBoxDepth: 15,
    goalBoxWidth: 36,
    penaltyBoxDepth: 42,
    penaltyBoxWidth: 108,
    // Spots:
    penaltyKickSpot: 30,
    arcFromKickSpot: 24,
    // Circles:
    hasArc: true,
    circleRadius: 24,
    // Goals:
    goalWidth: 21,
  },
  [FieldSize.nineTen]: {
    // Lengths and Widths:
    minWidth: 105,
    maxWidth: 135,
    recommendedMinWidth: 105,
    recommendedMaxWidth: 135,
    minLength: 165,
    maxLength: 195,
    recommendedMinLength: 165,
    recommendedMaxLength: 195,
    // Boxes:
    goalBoxDepth: 12,
    goalBoxWidth: 24,
    penaltyBoxDepth: 36,
    penaltyBoxWidth: 72,
    // Spots:
    penaltyKickSpot: 30,
    // Circles:
    hasArc: false,
    circleRadius: 24,
    // Goals:
    goalWidth: 18.5,
  },
  [FieldSize.sevenEight]: {
    // Lengths and Widths:
    minWidth: 45,
    maxWidth: 75,
    recommendedMinWidth: 45,
    recommendedMaxWidth: 75,
    minLength: 75,
    maxLength: 105,
    recommendedMinLength: 75,
    recommendedMaxLength: 105,
    // Boxes:
    goalBoxDepth: 12,
    goalBoxWidth: 15,
    // Spots:
    penaltyKickSpot: 15,
    // Circles:
    hasArc: false,
    circleRadius: 15,
    // Goals:
    goalWidth: 6,
  },
}
