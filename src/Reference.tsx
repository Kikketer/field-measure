import { Component } from 'solid-js'
import fieldReference from './fieldReference'

export const Reference: Component = () => {
  return (
    <div>
      <pre>{JSON.stringify(fieldReference, null, 2)}</pre>
    </div>
  )
}
