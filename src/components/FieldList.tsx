import { A } from '@solidjs/router'
import { Component, For, createResource } from 'solid-js'
import {
  formatDate,
  getPredictedNextPaintDate,
  getPredictedNextPaintLabel,
} from '../utils'
import styles from './FieldList.module.css'
import { getFields } from './FieldStore'
import { Page } from './Page'
import { StatusLabel } from './StatusLabel'

export const FieldList: Component = () => {
  const [fields] = createResource(getFields)

  return (
    <Page>
      <ul class={styles.FieldList}>
        <For
          each={fields()}
          fallback={<div class={styles.EmptyList}>There are no fields</div>}
        >
          {(field) => (
            <A href={`/field/${field.id}`} class={styles.FieldItemTag}>
              <li class={styles.FieldItemWrapper}>
                <div class={styles.FieldItemDetail}>
                  <div>{field.name}</div>
                  <div>Painted: {formatDate(field.lastPainted)}</div>
                </div>
                <div class={styles.StatusContainer}>
                  <StatusLabel field={field} />
                  <div>
                    {getPredictedNextPaintLabel(
                      getPredictedNextPaintDate(field),
                    )}{' '}
                    {formatDate(getPredictedNextPaintDate(field))}
                  </div>
                </div>
                <div class={styles.FieldAction}>&gt;</div>
              </li>
            </A>
          )}
        </For>
      </ul>
      <div class={styles.ActionContainer}>
        {/* <A class="button" href="/field/new">
          + Add Field
        </A> */}
        <A class="button" href="/quick">
          Quick Size
        </A>
      </div>
    </Page>
  )
}
