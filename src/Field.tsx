import { type Component, createSignal, For } from 'solid-js'
import { throttle } from 'lodash-es'
import styles from './Field.module.css'
import Soccer from './assets/Soccer.svg'
// import SoccerBuildout from './assets/Soccer-Buildout.svg'

const labels = [
  {
    lineName: 'goalline',
    id: 'goalline-midfield',
    x: 52.5,
    y: 24,
    text: 'A',
  },
]

export const Field: Component = () => {
  const [fieldHeight, setFieldHeight] = createSignal(
    document.getElementById('soccer-field')?.clientHeight,
  )

  window.addEventListener(
    'resize',
    throttle(() => {
      console.log('Re-size')
      setFieldHeight(document.getElementById('soccer-field')?.clientHeight)
    }, 200),
  )

  return (
    <div
      class={styles.FieldWrapper}
      style={{
        height: `${fieldHeight()}px`,
      }}
    >
      <Soccer id="soccer-field" style={{ width: '100%' }} />
      <For each={labels}>
        {(label) => (
          <div
            class={styles.Label}
            style={{ left: `${label.x}%`, top: `${label.y}%` }}
          >
            {label.text}
          </div>
        )}
      </For>
    </div>
  )
}
