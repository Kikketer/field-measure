import { A } from '@solidjs/router'
import { Accessor, Component, JSX, Setter, Show, useContext } from 'solid-js'
import { ChevronLeftIcon } from '../assets/ChevronLeftIcon'
import { Hamburger } from './Hamburger'
import { Field } from '../utilities/types'
import styles from './Header.module.css'
import { OnlineContext, OnlineStatus } from '../providers/OnlineStatusProvider'

export const Header: Component<{
  children?: JSX.Element
  backLocation?: string
  editFieldId?: Field['id']
  withMenu?: boolean
  setIsShowingDrawer?: Setter<boolean>
}> = (props) => {
  const isOnline = useContext(OnlineContext)

  return (
    <div class={styles.HeaderWrap}>
      <div class={styles.Header}>
        <Show when={props.backLocation}>
          <A
            class={styles.BackButton}
            href={props.backLocation!}
            replace={true}
          >
            <ChevronLeftIcon /> Back
          </A>
        </Show>
        <h1 class={styles.H1}>{props.children}</h1>
        <div class={styles.EndSlot}>
          <OnlineStatus />
          <Show when={props.withMenu}>
            <Hamburger onClick={() => props.setIsShowingDrawer?.(true)} />
          </Show>
          <Show when={props.editFieldId && isOnline?.()}>
            <A href={`edit`}>Edit</A>
          </Show>
        </div>
      </div>
    </div>
  )
}
