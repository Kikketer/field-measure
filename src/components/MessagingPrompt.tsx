import classNames from 'classnames'
import { Component, useContext } from 'solid-js'
import styles from './MessagingPrompt.module.css'
import { MessagingContext } from './MessagingProvider'

export const MessagingPrompt: Component = () => {
  const { hasSetupMessaging, ignoreMessaging, setupMessaging } =
    useContext(MessagingContext)

  if (hasSetupMessaging()) return null

  return (
    <div
      class={classNames(styles.MessagingPrompt, {
        [styles.Hide]: hasSetupMessaging(),
      })}
    >
      <div class="text-center">Enable notifications?</div>
      <div class={styles.ActionBlock}>
        <button
          class="secondary"
          type="button"
          onClick={() => ignoreMessaging()}
        >
          No
        </button>
        <button type="button" onClick={() => setupMessaging()}>
          Yes
        </button>
      </div>
    </div>
  )
}
