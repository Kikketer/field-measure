export type LineLabel = {
  lineName: string
  id: string
  group: string
  x: number
  y: number
  getLength: (T: { fieldWidth: number; fieldLength: number }) => number
}

export const LINE_LABELS: LineLabel[] = [
  // Corner
  {
    lineName: 'Midfield to Corner',
    id: 'midfield-corner',
    group: 'corner',
    x: 52.5,
    y: 24,
    getLength: () => 84.8,
  },
  {
    lineName: 'Goal to Corner',
    id: 'goal-corner',
    group: 'corner',
    x: 0,
    y: 3,
    getLength: () => 105,
  },
  // Penalty Box
  {
    lineName: 'Goaline to Penalty Box',
    id: 'goaline-penalty',
    group: 'penalty-box',
    x: 0,
    y: 15,
    getLength: () => 88,
  },
  {
    lineName: 'Midfield to Penalty Box',
    id: 'midfield-penalty',
    group: 'penalty-box',
    x: 45,
    y: 70,
    getLength: () => 88,
  },
  {
    lineName: 'Goal to Penalty Box',
    id: 'goal-penalty',
    group: 'penalty-box',
    x: 20,
    y: 70,
    getLength: () => 10,
  },
  // Goal Box
  {
    lineName: 'Goaline to Goal Box',
    id: 'goaline-goalbox',
    group: 'goal-box',
    x: 0,
    y: 32,
    getLength: () => 1,
  },
  {
    lineName: 'Midfield to Goal Box',
    id: 'midfield-goalbox',
    group: 'goal-box',
    x: 6,
    y: 40,
    getLength: () => 2,
  },
  {
    lineName: 'Goal to Goal Box',
    id: 'goal-goalbox',
    group: 'goal-box',
    x: 50,
    y: 40,
    getLength: () => 3,
  },
  // Penalty Kick Spot
  {
    lineName: 'Penalty Kick Spot',
    id: 'penalty-kick-spot',
    group: 'penalty-arcs',
    x: 10,
    y: 50,
    getLength: () => 4,
  },
  // Penalty Arc
  {
    lineName: 'Penalty Arc',
    id: 'penalty-arc',
    group: 'penalty-arcs',
    x: 25,
    y: 52,
    getLength: () => 5,
  },
  // Circle
  {
    lineName: 'Center Circle',
    id: 'center-circle',
    group: 'penalty-arcs',
    x: 90,
    y: 61,
    getLength: () => 6,
  },
]
