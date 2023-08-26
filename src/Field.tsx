import { createEffect, type Component, createSignal } from 'solid-js'
import styles from './Field.module.css'

export const Field: Component = () => {
  const [width, setWidth] = createSignal<number>()
  const [height, setHeight] = createSignal<number>()
  // 1.48 ratio // 0.69565

  createEffect(() => {
    const parentWidth =
      document.querySelector('#field-wrapper')?.clientWidth ?? 0
    const parentHeight =
      (document.querySelector('#field-wrapper')?.clientWidth ?? 0) * 0.69565

    setWidth(parentWidth)
    setHeight(parentHeight)
  })

  return (
    <canvas class={styles.Field} width={width()} height={height()} id="field" />
  )
}
