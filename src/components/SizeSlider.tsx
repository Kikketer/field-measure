import classNames from 'classnames'
import React, { useEffect, useMemo } from 'react'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import './SizeSlider.css'

type SizeSliderProps = {
  fieldSize: FieldSize
  type: 'width' | 'length'
  currentValue?: number
}

export const SizeSlider: React.FC<SizeSliderProps> = ({ fieldSize, type }) => {
  const hasRecommendedSize = useMemo(() => {
    // We just check to see if the minWidth === the recommended one to see that it's different
    // And if it IS different, the field has a recommended size
    return (
      SIZES[fieldSize].recommendedMinLength !== SIZES[fieldSize].minLength ||
      SIZES[fieldSize].recommendedMinWidth !== SIZES[fieldSize].minWidth
    )
  }, [fieldSize])

  // const currentPercentage = useMemo(() => {
  //   if (!currentValue) return 0
  //   // Get the percentages the currentValue is from the min to max within SIZES[fieldSize]:
  //   const min =
  //     type === 'length' ? SIZES[fieldSize].minLength : SIZES[fieldSize].minWidth
  //   const max =
  //     type === 'length' ? SIZES[fieldSize].maxLength : SIZES[fieldSize].maxWidth
  //   const percentage = ((currentValue - min) / (max - min)) * 100
  //
  //   if (percentage >= 0 && percentage <= 100) {
  //     return percentage
  //   }
  //   return 0
  // }, [currentValue])

  return (
    <div
      className={classNames('size-slider', {
        green: !hasRecommendedSize,
      })}
    >
      {hasRecommendedSize && (
        <div className="recommended" style={{ width: '50%' }} />
      )}
      {/* For now I'm not showing spot until we can drag it */}
      {/*<div className="spot" style={{ left: `${currentPercentage}%` }} />*/}
      <div className={'label'} style={{ left: '-0.4rem' }}>
        {type === 'length'
          ? SIZES[fieldSize].minLength
          : SIZES[fieldSize].minWidth}
      </div>
      {hasRecommendedSize && (
        <>
          <div className="label" style={{ left: 'calc(25% - 0.8rem)' }}>
            {type === 'length'
              ? SIZES[fieldSize].recommendedMinLength
              : SIZES[fieldSize].recommendedMinWidth}
          </div>
          <div className="label" style={{ left: 'calc(75% - 0.8rem)' }}>
            {type === 'length'
              ? SIZES[fieldSize].recommendedMaxLength
              : SIZES[fieldSize].recommendedMaxWidth}
          </div>
        </>
      )}
      <div className="label" style={{ left: 'calc(100% - 1.2rem)' }}>
        {type === 'length'
          ? SIZES[fieldSize].maxLength
          : SIZES[fieldSize].maxWidth}
      </div>
    </div>
  )
}
