import { A } from '@solidjs/router'
import { Accessor, createEffect, Setter, useContext } from 'solid-js'
import { Show } from 'solid-js/web'
import { MessagingContext } from '../providers/MessagingProvider'
import styles from './SettingsDrawer.module.css'

export const SettingsDrawer = (props: {
  isShown: Accessor<boolean>
  setIsShowingDrawer: Setter<boolean>
}) => {
  const messaging = useContext(MessagingContext)
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
            <A
              href={'team'}
              onClick={() =>
                document.querySelector('body')?.classList.remove('no-scroll')
              }
            >
              Edit Team
            </A>
          </li>
        </ul>
        <div>
          <ul>
            <li>
              <button onClick={() => messaging?.resetMessaging()}>
                Reset Push
              </button>
            </li>
            <li>
              <button onClick={() => messaging?.testPush()}>Test Push</button>
            </li>
          </ul>
          <p class={styles.small}>{JSON.stringify(messaging?.debug() ?? {})}</p>
        </div>
      </div>
    </Show>
  )
}
