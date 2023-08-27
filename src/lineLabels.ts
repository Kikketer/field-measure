import { SIZES } from './constants'
import { FieldSize } from './types'

export type LineLabel = {
  lineName: string
  id: string
  group: string
  x: number
  y: number
  getLength: (T: {
    fieldSize: FieldSize
    fieldWidth?: number
    fieldLength?: number
  }) => number
}

// Full size field dimensions:
export const LINE_LABELS: LineLabel[] = [
  // Corner
  {
    lineName: 'Half Field to Corner',
    id: 'half-corner',
    group: 'corner',
    x: 50,
    y: 1,
    getLength: ({ fieldSize, fieldLength }) =>
      (fieldLength ?? SIZES[fieldSize].recommendedMaxLength) / 2,
  },
  {
    lineName: 'Midfield to Corner',
    id: 'midfield-corner',
    group: 'corner',
    x: 52.5,
    y: 24,
    getLength: ({ fieldSize, fieldLength, fieldWidth }) => {
      const halfLength =
        (fieldLength ?? SIZES[fieldSize].recommendedMaxLength) / 2
      const halfWidth = (fieldWidth ?? SIZES[fieldSize].recommendedMaxWidth) / 2
      const hypotenuse = Math.sqrt(halfLength ** 2 + halfWidth ** 2)
      return hypotenuse
    },
  },
  {
    lineName: 'Goal to Corner',
    id: 'goal-corner',
    group: 'corner',
    x: 0,
    y: 3,
    getLength: ({ fieldSize, fieldWidth }) =>
      (fieldWidth ?? SIZES[fieldSize].recommendedMaxWidth) / 2,
  },
  // Penalty Box
  {
    lineName: 'Goaline to Penalty Box',
    id: 'goaline-penalty',
    group: 'penalty-box',
    x: 0,
    y: 15,
    getLength: ({ fieldSize }) => (SIZES[fieldSize].penaltyBoxWidth ?? 0) / 2,
  },
  {
    lineName: 'Midfield to Penalty Box',
    id: 'midfield-penalty',
    group: 'penalty-box',
    x: 45,
    y: 70,
    getLength: ({ fieldSize, fieldLength }) => {
      const penaltyBoxWidth = (SIZES[fieldSize].penaltyBoxWidth ?? 0) / 2
      const penaltyBoxDepth = SIZES[fieldSize].penaltyBoxDepth ?? 0
      // We make this a right triangle by finding the distance of the top of the box
      // to the mid-field line
      const midToBoxTop =
        (fieldLength ?? SIZES[fieldSize].recommendedMaxLength) / 2 -
        penaltyBoxDepth
      const hypotenuse = Math.sqrt(penaltyBoxWidth ** 2 + midToBoxTop ** 2)
      return hypotenuse
    },
  },
  {
    lineName: 'Goal to Penalty Box',
    id: 'goal-penalty',
    group: 'penalty-box',
    x: 20,
    y: 70,
    getLength: ({ fieldSize }) => {
      const penaltyBoxWidth = (SIZES[fieldSize].penaltyBoxWidth ?? 0) / 2
      const penaltyBoxDepth = SIZES[fieldSize].penaltyBoxDepth ?? 0
      const hypotenuse = Math.sqrt(penaltyBoxWidth ** 2 + penaltyBoxDepth ** 2)
      return hypotenuse
    },
  },
  // Goal Box
  {
    lineName: 'Goaline to Goal Box',
    id: 'goaline-goalbox',
    group: 'goal-box',
    x: 0,
    y: 32,
    getLength: ({ fieldSize }) => (SIZES[fieldSize].goalBoxWidth ?? 0) / 2,
  },
  {
    lineName: 'Midfield to Goal Box',
    id: 'midfield-goalbox',
    group: 'goal-box',
    x: 50,
    y: 40,
    getLength: ({ fieldSize, fieldLength }) => {
      const goalBoxWidth = (SIZES[fieldSize].goalBoxWidth ?? 0) / 2
      const goalBoxDepth = SIZES[fieldSize].goalBoxDepth ?? 0
      // We make this a right triangle by finding the distance of the top of the box
      // to the mid-field line
      const midToBoxTop =
        (fieldLength ?? SIZES[fieldSize].recommendedMaxLength) / 2 -
        goalBoxDepth
      const hypotenuse = Math.sqrt(goalBoxWidth ** 2 + midToBoxTop ** 2)
      return hypotenuse
    },
  },
  {
    lineName: 'Goal to Goal Box',
    id: 'goal-goalbox',
    group: 'goal-box',
    x: 6,
    y: 40,
    getLength: ({ fieldSize }) => {
      const goalBoxWidth = (SIZES[fieldSize].goalBoxWidth ?? 0) / 2
      const goalBoxDepth = SIZES[fieldSize].goalBoxDepth ?? 0
      const hypotenuse = Math.sqrt(goalBoxWidth ** 2 + goalBoxDepth ** 2)
      return hypotenuse
    },
  },
  // Penalty Kick Spot
  {
    lineName: 'Penalty Kick Spot',
    id: 'penalty-kick-spot',
    group: 'penalty-arcs',
    x: 10,
    y: 50,
    getLength: ({ fieldSize }) => SIZES[fieldSize].penaltyKickSpot,
  },
  // Penalty Arc
  {
    lineName: 'Penalty Arc',
    id: 'penalty-arc',
    group: 'penalty-arcs',
    x: 25,
    y: 52,
    getLength: ({ fieldSize }) => SIZES[fieldSize].arcFromKickSpot ?? 0,
  },
  // Circle
  {
    lineName: 'Center Circle',
    id: 'center-circle',
    group: 'penalty-arcs',
    x: 90,
    y: 61,
    getLength: ({ fieldSize }) => SIZES[fieldSize].circleRadius,
  },
]
