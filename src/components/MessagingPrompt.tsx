import { Component, createSignal, useContext } from 'solid-js'
import styles from './MessagingPrompt.module.css'
import { MessagingContext } from './MessagingProvider'

export const MessagingPrompt: Component = () => {
  const messagingContext = useContext(MessagingContext)
  const [shouldShowPrompt, setShouldShowPrompt] = createSignal(
    !messagingContext?.hasSetupMessaging(),
  )

  const confirmMessaging = () => {
    messagingContext?.setupMessaging()
    setShouldShowPrompt(false)
  }

  const ignoreMessaging = () => {
    messagingContext?.ignoreMessaging()
    setShouldShowPrompt(false)
  }

  return (
    <dialog open={shouldShowPrompt()}>
      <article class={styles.Col}>
        <p>
          Would you like to enable notifications?
          <br />
          We will only notify you once per day if any field needs attention
          soon.
        </p>

        <div class={styles.Row}>
          <button class="secondary" onClick={ignoreMessaging}>
            No
          </button>
          <button onClick={confirmMessaging}>Yes</button>
        </div>
      </article>
    </dialog>
  )
}
