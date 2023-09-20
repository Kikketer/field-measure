import { Component, JSX, Show } from 'solid-js'
import { ChevronLeft } from './chevron-left'
import styles from './Header.module.css'

export const Header: Component<{
  children?: JSX.Element
  hideBack?: boolean
}> = ({ children, hideBack }) => {
  return (
    <div class={styles.HeaderWrap}>
      <div class={styles.Header}>
        <Show when={!hideBack}>
          <a class={styles.BackButton} onClick={() => history.back()}>
            <ChevronLeft /> Back
          </a>
        </Show>
        <h1 class={styles.H1}>{children}</h1>
      </div>
    </div>
  )
}
