import { A } from '@solidjs/router'
import { Accessor, createEffect, Setter } from 'solid-js'
import { Show } from 'solid-js/web'
import styles from './SettingsDrawer.module.css'

export const SettingsDrawer = (props: {
  isShown: Accessor<boolean>
  setIsShowingDrawer: Setter<boolean>
}) => {
  // let drawer!: HTMLDivElement
  const { isShown } = props

  // onTransitionEnd(() => {
  //   drawer.style.transform = ''
  // })

  createEffect(() => {
    if (isShown?.()) {
      document.querySelector('body')?.classList.add('no-scroll')
    } else {
      document.querySelector('body')?.classList.remove('no-scroll')
    }
  }, [isShown])

  return (
    <Show when={isShown?.()}>
      <div
        class={styles.drawerBackdrop}
        onClick={() => props.setIsShowingDrawer?.(false)}
      />
      <div class={styles.drawer}>
        <ul>
          <li>
            <A href={'team'}>Edit Team</A>
          </li>
        </ul>
        <div>
          <ul>
            <li>Reset Push</li>
            <li>Test Push</li>
          </ul>
          <p class={styles.small}>{navigator.userAgent}</p>
        </div>
      </div>
    </Show>
  )
}
