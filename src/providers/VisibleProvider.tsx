import { Component, createContext, createSignal, JSX } from 'solid-js'

export const VisibleContext = createContext<() => boolean>()

export const VisibleProvider: Component<{ children: JSX.Element }> = (
  props,
) => {
  const [isVisible, setIsVisible] = createSignal(!document.hidden)

  document.addEventListener('visibilitychange', () => {
    setIsVisible(!document.hidden)
  })

  return (
    <VisibleContext.Provider value={isVisible}>
      {props.children}
    </VisibleContext.Provider>
  )
}
