import { Accessor, createEffect, Setter } from 'solid-js'
import { Show } from 'solid-js/web'

export const SettingsDrawer = (props: {
  isShown: Accessor<boolean>
  setIsShowingDrawer: Setter<boolean>
}) => {
  // let drawer!: HTMLDivElement
  const { isShown } = props

  // onTransitionEnd(() => {
  //   drawer.style.transform = ''
  // })

  createEffect(() => {
    console.log('isShown', isShown?.())
  }, [isShown])

  return (
    <>
      <style>
        {`
        .drawer {
          position: fixed;
          top: 0;
          height: 100vh;
          width: 300px;
          z-index: 1001;
          right: 0;
          background: var(--background-color);
          padding: 1rem;
          border-left: 1px solid var(--contrast-focus);
        }
        .drawer-backdrop {
          position: fixed;
          top: 0;
          height: 100vh;
          width: 100vw;
          z-index: 1000;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        `}
      </style>
      <Show when={isShown?.()}>
        <div
          class="drawer-backdrop"
          onClick={() => props.setIsShowingDrawer?.(false)}
        />
        <div class="drawer">
          <ul>
            <li>Reset Push</li>
            <li>Test Push</li>
          </ul>
        </div>
      </Show>
    </>
  )
}
