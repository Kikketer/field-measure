import { Component, createEffect, createSignal, Show } from 'solid-js'
import styles from './ErrorPrompt.module.css'

type ErrorPrompt = {
  error: () => string | undefined
}

export const ErrorPrompt: Component<ErrorPrompt> = (props) => {
  const [show, setShow] = createSignal(!!props.error())

  createEffect(() => {
    if (show()) {
      setTimeout(() => {
        setShow(false)
      }, 3000)
    }
  })

  return (
    <Show when={props.error() && show()}>
      <p class={styles.Warning}>{props.error()}</p>
    </Show>
  )
}
