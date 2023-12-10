import { Component, useContext } from 'solid-js'
import { MessagingContext } from './MessagingProvider'

export const MessagingPrompt: Component = () => {
  const messagingContext = useContext(MessagingContext)

  if (messagingContext?.hasSetupMessaging()) return null

  if (window.confirm('Enable notifications?')) {
    messagingContext?.setupMessaging()
  } else {
    messagingContext?.ignoreMessaging()
  }

  return null
}
