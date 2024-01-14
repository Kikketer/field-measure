import { Accessor, Component, createEffect, Match, Show } from 'solid-js'
import styles from './ConfirmPaint.module.css'

const StandardUnplayablePrompt = (props) => {
  return (
    <article class={styles.Col}>
      <p>Was this field unplayable when you painted it?</p>
      <div>
        <button onClick={() => props.onPaint({ shouldAdjustFactor: true })}>
          Unplayable
        </button>
        <button onClick={() => props.onPaint({ shouldAdjustFactor: false })}>
          Playable but Painted Anyway
        </button>
        <button class="secondary" onClick={() => props.onCancel?.()}>
          Cancel
        </button>
      </div>
    </article>
  )
}

const OverduePrompt = (props) => {
  return (
    <article class={styles.Col}>
      <p>
        This field was overdue by{' '}
        <strong>{-(props.daysRemaining?.() ?? 0)}</strong> days. Was it playable
        until today or was it unplayable for {-(props.daysRemaining?.() ?? 0)}{' '}
        days?
      </p>
      <div>
        <button onClick={() => props.onPaint({ shouldAdjustFactor: true })}>
          Was Playable Until Today
        </button>
        <button onClick={() => props.onPaint({ shouldAdjustFactor: false })}>
          Was Not Playable {-(props.daysRemaining?.() ?? 0)} Days Ago
        </button>
        <button class="secondary" onClick={() => props.onCancel}>
          Cancel
        </button>
      </div>
    </article>
  )
}

const WayOverduePrompt = (props) => {
  return (
    <article class={styles.Col}>
      <p>
        This field is way overdue. Painting it now will not update it's
        predicted dates.
      </p>
      <div>
        <button onClick={() => props.onPaint({ shouldAdjustFactor: false })}>
          Mark Painted
        </button>
        <button class="secondary" onClick={() => props.onCancel}>
          Cancel
        </button>
      </div>
    </article>
  )
}

export const ConfirmPaint: Component<{
  show?: Accessor<boolean>
  daysRemaining?: Accessor<number>
  onPaint: (T: { shouldAdjustFactor: boolean }) => void
  reasonableLimitOfOverdueDays: Accessor<number>
  onCancel?: () => void
}> = (props) => {
  return (
    <dialog open={props.show?.()}>
      <Switch>
        <Match
          when={
            props.daysRemaining?.() &&
            props.daysRemaining() < -props.reasonableLimitOfOverdueDays()
          }
        >
          <WayOverduePrompt {...props} />
        </Match>
        <Match when={props.daysRemaining?.() && props.daysRemaining() < 0}>
          <OverduePrompt {...props} />
        </Match>
        <Match when={true}>
          <StandardUnplayablePrompt {...props} />
        </Match>
      </Switch>
    </dialog>
  )
}
