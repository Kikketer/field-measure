import React, { Fragment } from 'react'
import { SketchFullField } from '../assets/SketchFullField'
import { SketchBuildout } from '../assets/SketchBuildout'
import { SketchBaby } from '../assets/SketchBaby'
import { convertToFeet } from '../utilities/convertToFeet'
import {
  BUILDOUT_LINE_LABELS,
  FULL_LINE_LABELS,
  TINY_LINE_LABELS,
} from '../utilities/lineLabels'
import { FieldSize } from '../utilities/types'
import { SIZES } from '../utilities/constants'
import './Field.css'

type FieldProps = {
  fieldSize: FieldSize
  customWidth?: number | undefined
  customLength?: number | undefined
}

const getSoccerFieldImage = (size: FieldSize) => {
  switch (size) {
    case FieldSize.full:
    case FieldSize.elevenThirteen:
      return <SketchFullField />
    case FieldSize.nineTen:
      return <SketchBuildout />
    case FieldSize.sevenEight:
      return <SketchBaby />
  }
}

const getLabelsForField = (fieldSize: FieldSize) => {
  switch (fieldSize) {
    case FieldSize.full:
    case FieldSize.elevenThirteen:
      return FULL_LINE_LABELS
    case FieldSize.nineTen:
      return BUILDOUT_LINE_LABELS
    case FieldSize.sevenEight:
      return TINY_LINE_LABELS
  }
}

export const FieldSketch: React.FC<FieldProps> = ({
  fieldSize,
  customWidth,
  customLength,
}) => {
  return (
    <div id="field-drawing">
      {getSoccerFieldImage(fieldSize)}
      {/*{getLabelsForField(fieldSize).map((label) => (*/}
      {/*  <Fragment key={label.id}>*/}
      {/*    {!!label.getLength({*/}
      {/*      fieldSize,*/}
      {/*      fieldWidth: customWidth,*/}
      {/*      fieldLength: customLength,*/}
      {/*    }) && (*/}
      {/*      <div*/}
      {/*        className="label"*/}
      {/*        style={{ left: `${label.x}%`, top: `${label.y}%` }}*/}
      {/*      >*/}
      {/*        {convertToFeet(*/}
      {/*          label.getLength({*/}
      {/*            fieldSize,*/}
      {/*            fieldWidth: customWidth,*/}
      {/*            fieldLength: customLength,*/}
      {/*          }),*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </Fragment>*/}
      {/*))}*/}
      <div className="label" style={{ left: '20%', top: '90%', width: '60%' }}>
        {fieldSize}: {customLength ?? SIZES[fieldSize].recommendedMaxLength}L x{' '}
        {customWidth ?? SIZES[fieldSize].recommendedMaxWidth}W
      </div>
    </div>
  )
}
