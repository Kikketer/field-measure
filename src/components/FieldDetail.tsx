import { Component } from 'solid-js'
import { Field } from '../types'
import { A } from '@solidjs/router'

export const FieldDetail: Component = () => {
  return (
    <div>
      <A href="/" replace>
        &lt; Back
      </A>
      <p>Detail</p>
    </div>
  )
}
