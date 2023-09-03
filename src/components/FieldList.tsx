import { Component, For } from 'solid-js'
import { Field } from '../types'
import styles from './FieldList.module.css'
import { A } from '@solidjs/router'

type FieldListProps = {
  fields: () => Field[] | undefined
  loading?: boolean
}

export const FieldList: Component<FieldListProps> = ({ fields, loading }) => {
  return (
    <ul class={styles.FieldList}>
      <For each={fields()} fallback={<div>Loading...</div>}>
        {(field) => (
          <A href={`/field/${field.id}`}>
            <li class={styles.FieldItemWrapper}>
              <div class={styles.FieldItemDetail}>
                <div>{field.name}</div>
                <div>
                  {new Date(field.last_painted).toLocaleDateString('en-US')}
                </div>
              </div>
              <div class={styles.StatusContainer}>
                <span role="img" aria-label="Green">
                  🟢
                </span>
              </div>
              <div class={styles.FieldAction}>&gt;</div>
            </li>
          </A>
        )}
      </For>
    </ul>
  )
}
