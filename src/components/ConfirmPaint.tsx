import { Accessor, Component, createEffect, Show } from 'solid-js'
import styles from './ConfirmPaint.module.css'

export const ConfirmPaint: Component<{
  show?: Accessor<boolean>
  daysRemaining?: Accessor<number>
  onPaint: (T: { shouldAdjustFactor: boolean }) => void
  onCancel?: () => void
}> = (props) => {
  return (
    <dialog open={props.show?.()}>
      <Show
        when={props.daysRemaining?.() && props.daysRemaining() < 0}
        fallback={
          <article class={styles.Col}>
            <p>Was this field unplayable when you painted it?</p>
            <div>
              <button
                onClick={() => props.onPaint({ shouldAdjustFactor: true })}
              >
                Unplayable
              </button>
              <button
                onClick={() => props.onPaint({ shouldAdjustFactor: false })}
              >
                Playable but Painted Anyway
              </button>
              <button class="secondary" onClick={() => props.onCancel?.()}>
                Cancel
              </button>
            </div>
          </article>
        }
      >
        <article class={styles.Col}>
          <p>
            This field was overdue by{' '}
            <strong>{-(props.daysRemaining?.() ?? 0)}</strong> days. Was it
            playable until today or was it unplayable for{' '}
            {-(props.daysRemaining?.() ?? 0)} days?
          </p>
          <div>
            <button onClick={() => props.onPaint({ shouldAdjustFactor: true })}>
              Was Playable Until Today
            </button>
            <button
              onClick={() => props.onPaint({ shouldAdjustFactor: false })}
            >
              Was Not Playable {-(props.daysRemaining?.() ?? 0)} Days Ago
            </button>
            <button className="secondary" onClick={() => props.onCancel}>
              Cancel
            </button>
          </div>
        </article>
      </Show>
    </dialog>
  )
}
