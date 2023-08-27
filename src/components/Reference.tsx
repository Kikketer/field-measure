import { Component } from 'solid-js'
import { SIZES } from '../constants'

export const Reference: Component = () => {
  return (
    <div>
      <pre>{JSON.stringify(SIZES, null, 2)}</pre>
    </div>
  )
}
