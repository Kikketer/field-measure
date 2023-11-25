import classNames from 'classnames'
import { Component, useContext } from 'solid-js'
import styles from './MessagingPrompt.module.css'
import { MessagingContext } from './MessagingProvider.tsx'

export const MessagingPrompt: Component = () => {
  const { hasSetupMessaging, ignoreMessaging } = useContext(MessagingContext)

  console.log('setup messaging', hasSetupMessaging())

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
        <button type="button">Yes</button>
      </div>
    </div>
  )
}
