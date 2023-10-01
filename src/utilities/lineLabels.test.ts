import { BUILDOUT_LINE_LABELS, FULL_LINE_LABELS, TINY_LINE_LABELS } from "./lineLabels";
import { FieldSize } from "./types";

const smallerFullSizes = { fieldLength: 300, fieldWidth: 150 };
const smallerElevenSizes = { fieldLength: 210, fieldWidth: 135 };
const smallerNineTenSizes = { fieldLength: 165, fieldWidth: 105 };
const smallerEightNineFields = { fieldLength: 75, fieldWidth: 45 };

const fullSizeFieldTests = [
  { id: "half-corner", expectedLength: 172.5 },
  { id: "half-corner", ...smallerFullSizes, expectedLength: 150 },
  { id: "midfield-corner", expectedLength: 210.1338858918285 },
  { id: "midfield-corner", ...smallerFullSizes, expectedLength: 167.70509831248424 },
  { id: "goal-corner", expectedLength: 120 },
  { id: "goal-corner", ...smallerFullSizes, expectedLength: 75 },
  { id: "goaline-penalty", expectedLength: 66 },
  { id: "goaline-penalty", ...smallerFullSizes, expectedLength: 66 },
  { id: "midfield-penalty", expectedLength: 135.64014892353958 },
  { id: "midfield-penalty", ...smallerFullSizes, expectedLength: 116.49892703368559 },
  { id: "goal-penalty", expectedLength: 85.27602242131137 },
  { id: "goal-penalty", ...smallerFullSizes, expectedLength: 85.27602242131137 },
  { id: "goaline-goalbox", expectedLength: 33 },
  { id: "goaline-goalbox", ...smallerFullSizes, expectedLength: 33 },
  { id: "midfield-goalbox", expectedLength: 157.98496763932954 },
  { id: "midfield-goalbox", ...smallerFullSizes, expectedLength: 136.0624856453828 },
  { id: "goal-goalbox", expectedLength: 37.589892258425 },
  { id: "goal-goalbox", ...smallerFullSizes, expectedLength: 37.589892258425 },
  { id: "penalty-kick-spot", expectedLength: 36 },
  { id: "penalty-kick-spot", ...smallerFullSizes, expectedLength: 36 },
  { id: "penalty-arc", expectedLength: 30 },
  { id: "penalty-arc", ...smallerFullSizes, expectedLength: 30 },
  { id: "center-circle", expectedLength: 30 },
  { id: "center-circle", ...smallerFullSizes, expectedLength: 30 }
];

const elevenThirteenFieldTests = [
  { id: "half-corner", expectedLength: 120 },
  { id: "half-corner", ...smallerElevenSizes, expectedLength: 105 },
  { id: "midfield-corner", expectedLength: 145.623658792107 },
  { id: "midfield-corner", ...smallerElevenSizes, expectedLength: 124.82487732819929 },
  { id: "goal-corner", expectedLength: 82.5 },
  { id: "goal-corner", ...smallerElevenSizes, expectedLength: 67.5 },
  { id: "goaline-penalty", expectedLength: 54 },
  { id: "goaline-penalty", ...smallerElevenSizes, expectedLength: 54 },
  { id: "midfield-penalty", expectedLength: 94.86832980505137 },
  { id: "midfield-penalty", ...smallerElevenSizes, expectedLength: 82.97590011563598 },
  { id: "goal-penalty", expectedLength: 68.41052550594829 },
  { id: "goal-penalty", ...smallerElevenSizes, expectedLength: 68.41052550594829 },
  { id: "goaline-goalbox", expectedLength: 18 },
  { id: "goaline-goalbox", ...smallerElevenSizes, expectedLength: 18 },
  { id: "midfield-goalbox", expectedLength: 106.53168542738823 },
  { id: "midfield-goalbox", ...smallerElevenSizes, expectedLength: 91.78235124467012 },
  { id: "goal-goalbox", expectedLength: 23.430749027719962 },
  { id: "goal-goalbox", ...smallerElevenSizes, expectedLength: 23.430749027719962 },
  { id: "penalty-kick-spot", expectedLength: 30 },
  { id: "penalty-kick-spot", ...smallerElevenSizes, expectedLength: 30 },
  { id: "penalty-arc", expectedLength: 24 },
  { id: "penalty-arc", ...smallerElevenSizes, expectedLength: 24 },
  { id: "center-circle", expectedLength: 24 },
  { id: "center-circle", ...smallerElevenSizes, expectedLength: 24 }
];

const nineTenFieldTests = [
  { id: "half-corner", expectedLength: 97.5 },
  { id: "half-corner", ...smallerNineTenSizes, expectedLength: 82.5 },
  { id: "midfield-corner", expectedLength: 118.58541225631423 },
  { id: "midfield-corner", ...smallerNineTenSizes, expectedLength: 97.78803607803972 },
  { id: "goal-corner", expectedLength: 67.5 },
  { id: "goal-corner", ...smallerNineTenSizes, expectedLength: 52.5 },
  { id: "goaline-penalty", expectedLength: 36 },
  { id: "goaline-penalty", ...smallerNineTenSizes, expectedLength: 36 },
  { id: "midfield-penalty", expectedLength: 71.26184112131821 },
  { id: "midfield-penalty", ...smallerNineTenSizes, expectedLength: 58.80688735173798 },
  { id: "goal-penalty", expectedLength: 50.91168824543142 },
  { id: "goal-penalty", ...smallerNineTenSizes, expectedLength: 50.91168824543142 },
  { id: "goaline-goalbox", expectedLength: 12 },
  { id: "goaline-goalbox", ...smallerNineTenSizes, expectedLength: 12 },
  { id: "midfield-goalbox", expectedLength: 86.33799858694896 },
  { id: "midfield-goalbox", ...smallerNineTenSizes, expectedLength: 71.51398464636131 },
  { id: "goal-goalbox", expectedLength: 16.97056274847714 },
  { id: "goal-goalbox", ...smallerNineTenSizes, expectedLength: 16.97056274847714 },
  { id: "penalty-kick-spot", expectedLength: 30 },
  { id: "penalty-kick-spot", ...smallerNineTenSizes, expectedLength: 30 },
  // There is no arc for these fields, so this returns 0
  { id: "penalty-arc", expectedLength: 0 },
  { id: "penalty-arc", ...smallerNineTenSizes, expectedLength: 0 },
  { id: "center-circle", expectedLength: 24 },
  { id: "center-circle", ...smallerNineTenSizes, expectedLength: 24 },
  // Buildouts!
  { id: "midfield-buildout", expectedLength: 79.89876407054116 },
  { id: "midfield-buildout", ...smallerNineTenSizes, expectedLength: 63.236164494694016 },
  { id: "goal-buildout", expectedLength: 86.91267168831021 },
  { id: "goal-buildout", ...smallerNineTenSizes, expectedLength: 70.63152624713697 }
];

const sevenEightFieldTests = [
  { id: "half-corner", expectedLength: 52.5 },
  { id: "half-corner", ...smallerEightNineFields, expectedLength: 37.5 },
  { id: "midfield-corner", expectedLength: 64.5174395028197 },
  { id: "midfield-corner", ...smallerEightNineFields, expectedLength: 43.73213921133976 },
  { id: "goal-corner", expectedLength: 37.5 },
  { id: "goal-corner", ...smallerEightNineFields, expectedLength: 22.5 },
  { id: "goaline-penalty", expectedLength: 7.5 },
  { id: "goaline-penalty", ...smallerEightNineFields, expectedLength: 7.5 },
  { id: "midfield-penalty", expectedLength: 41.188590653237945 },
  { id: "midfield-penalty", ...smallerEightNineFields, expectedLength: 26.580067720004024 },
  { id: "goaline-goalbox", expectedLength: 7.5 },
  { id: "goaline-goalbox", ...smallerEightNineFields, expectedLength: 7.5 },
  { id: "midfield-goalbox", expectedLength: 41.188590653237945 },
  { id: "midfield-goalbox", ...smallerEightNineFields, expectedLength: 26.580067720004024 },
  { id: "goal-goalbox", expectedLength: 14.150971698084906 },
  { id: "goal-goalbox", ...smallerEightNineFields, expectedLength: 14.150971698084906 },
  { id: "penalty-kick-spot", expectedLength: 15 },
  { id: "penalty-kick-spot", ...smallerEightNineFields, expectedLength: 15 },
  { id: "center-circle", expectedLength: 15 },
  { id: "center-circle", ...smallerEightNineFields, expectedLength: 15 }
];

describe("Line Labels", () => {
  describe("Full Sized Fields", () => {
    const fieldSize = FieldSize.full;

    FULL_LINE_LABELS.forEach((lineLabel) => {
      // Get the corresponding tests for this lineLabel based on id
      const testsForThisLineLabel =
        fullSizeFieldTests.filter((test) => test.id === lineLabel.id) ?? [];

      testsForThisLineLabel.forEach((test) => {
        const { fieldLength, fieldWidth, expectedLength } = test;

        it(`should return ${expectedLength} for ${
          lineLabel.lineName
        } with fieldLength ${fieldLength ?? "recommended"} and fieldWidth ${
          fieldWidth ?? "recommended"
        }`, () => {
          expect(
            lineLabel.getLength({
              fieldSize,
              fieldLength,
              fieldWidth
            })
          ).toBe(expectedLength);
        });
      });
    });
  });

  describe("11/13 Fields", () => {
    const fieldSize = FieldSize.elevenThirteen;

    // 11/13 fields use the ratios of a full size, just different base sizes
    FULL_LINE_LABELS.forEach((lineLabel) => {
      // Get the corresponding tests for this lineLabel based on id
      const testsForThisLineLabel =
        elevenThirteenFieldTests.filter((test) => test.id === lineLabel.id) ?? [];

      testsForThisLineLabel.forEach((test) => {
        const { fieldLength, fieldWidth, expectedLength } = test;

        it(`should return ${expectedLength} for ${
          lineLabel.lineName
        } with fieldLength ${fieldLength ?? "recommended"} and fieldWidth ${
          fieldWidth ?? "recommended"
        }`, () => {
          expect(
            lineLabel.getLength({
              fieldSize,
              fieldLength,
              fieldWidth
            })
          ).toBe(expectedLength);
        });
      });
    });
  });

  describe("9/10 Fields", () => {
    const fieldSize = FieldSize.nineTen;

    BUILDOUT_LINE_LABELS.forEach((lineLabel) => {
      // Get the corresponding tests for this lineLabel based on id
      const testsForThisLineLabel =
        nineTenFieldTests.filter((test) => test.id === lineLabel.id) ?? [];

      testsForThisLineLabel.forEach((test) => {
        const { fieldLength, fieldWidth, expectedLength } = test;

        it(`should return ${expectedLength} for ${
          lineLabel.lineName
        } with fieldLength ${fieldLength ?? "recommended"} and fieldWidth ${
          fieldWidth ?? "recommended"
        }`, () => {
          expect(
            lineLabel.getLength({
              fieldSize,
              fieldLength,
              fieldWidth
            })
          ).toBe(expectedLength);
        });
      });
    });
  });

  describe("7/8 Fields", () => {
    const fieldSize = FieldSize.sevenEight;

    TINY_LINE_LABELS.forEach((lineLabel) => {
      // Get the corresponding tests for this lineLabel based on id
      const testsForThisLineLabel =
        sevenEightFieldTests.filter((test) => test.id === lineLabel.id) ?? [];

      testsForThisLineLabel.forEach((test) => {
        const { fieldLength, fieldWidth, expectedLength } = test;

        it(`should return ${expectedLength} for ${
          lineLabel.lineName
        } with fieldLength ${fieldLength ?? "recommended"} and fieldWidth ${
          fieldWidth ?? "recommended"
        }`, () => {
          expect(
            lineLabel.getLength({
              fieldSize,
              fieldLength,
              fieldWidth
            })
          ).toBe(expectedLength);
        });
      });
    });
  });
});
