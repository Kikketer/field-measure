import { Component, createEffect, createSignal, useContext } from 'solid-js'
import { OnlineContext } from './OnlineStatusProvider.tsx'
import { getFields } from '../utilities/FieldStore'
import styles from './RefreshData.module.css'

export const RefetchData: Component = () => {
  const isOnline = useContext(OnlineContext)
  const [isVisible, setIsVisible] = createSignal(!document.hidden)
  const [loading, setLoading] = createSignal(false)

  document.addEventListener('visibilitychange', () => {
    setIsVisible(!document.hidden)
  })

  createEffect(() => {
    if (isOnline() && isVisible()) {
      setLoading(true)
      getFields(true)
    }
  })

  return <div class={styles.RefreshLoader} />
}
