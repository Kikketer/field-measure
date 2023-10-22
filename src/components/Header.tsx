import { A } from '@solidjs/router'
import { Component, JSX, Show, useContext } from 'solid-js'
import { ChevronLeftIcon } from '../assets/ChevronLeftIcon'
import { Field } from '../utilities/types'
import styles from './Header.module.css'
import { OnlineContext, OnlineStatus } from './OnlineStatusProvider'

export const Header: Component<{
  children?: JSX.Element
  backLocation?: string
  editFieldId?: Field['id']
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
        <OnlineStatus />
        <Show when={props.editFieldId && isOnline?.()}>
          <A href={`edit`}>Edit</A>
        </Show>
      </div>
    </div>
  )
}
