import { A } from '@solidjs/router'
import { Component, JSX, Show } from 'solid-js'
import { Field } from '../utilities/types'
import styles from './Header.module.css'
import { ChevronLeft } from './chevron-left'

export const Header: Component<{
  children?: JSX.Element
  backLocation?: string
  editFieldId?: Field['id']
}> = ({ children, backLocation, editFieldId }) => {
  return (
    <div class={styles.HeaderWrap}>
      <div class={styles.Header}>
        <Show when={backLocation}>
          <A class={styles.BackButton} href={backLocation!} replace={true}>
            <ChevronLeft /> Back
          </A>
        </Show>
        <h1 class={styles.H1}>{children}</h1>
        <Show when={editFieldId}>
          <A href={`edit`}>Edit</A>
        </Show>
      </div>
    </div>
  )
}
