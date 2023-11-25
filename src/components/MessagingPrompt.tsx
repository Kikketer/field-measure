import classNames from 'classnames'
import { Component, useContext } from 'solid-js'
import styles from './MessagingPrompt.module.css'
import { MessagingContext } from './MessagingProvider'

export const MessagingPrompt: Component = () => {
  const messagingContext = useContext(MessagingContext)

  if (messagingContext?.hasSetupMessaging()) return null

  return (
    <div
      class={classNames(styles.MessagingPrompt, {
        [styles.Hide]: messagingContext?.hasSetupMessaging(),
      })}
    >
      <div class="text-center">Enable notifications?</div>
      <div class={styles.ActionBlock}>
        <button
          class="secondary"
          type="button"
          onClick={() => messagingContext?.ignoreMessaging()}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => messagingContext?.setupMessaging()}
        >
          Yes
        </button>
      </div>
    </div>
  )
}
