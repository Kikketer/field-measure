import { Component } from 'solid-js'
import styles from './SizeSlider.module.css'

export const SizeSlider: Component = () => {
  return (
    <div class={styles.SizeSliderWrap}>
      <div class={styles.RecommendedZone} style={{ width: '50px' }} />
      <div class={styles.Spot} />
    </div>
  )
}
