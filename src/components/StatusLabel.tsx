import classNames from 'classnames'
import { Field } from '../utilities/types'
import { getIsFieldPlayable } from '../utilities/utils'
import styles from './StatusLabel.module.css'

export const StatusLabel: React.FC<{ field?: Field }> = ({ field }) => {
  if (!field?.lastPainted) return null

  return (
    <div
      className={classNames(
        styles.StatusPill,
        getIsFieldPlayable(field) ? styles.StatusGreen : styles.StatusRed,
      )}
    >
      {getIsFieldPlayable(field) ? 'Playable' : 'Not Playable'}
    </div>
  )
}
