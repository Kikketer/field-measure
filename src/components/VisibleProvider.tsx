import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'

const VisibleContext = createContext<boolean>(true)

export const VisibleProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(!document.hidden)

  document.addEventListener('visibilitychange', () => {
    setIsVisible(!document.hidden)
  })

  return (
    <VisibleContext.Provider value={isVisible}>
      {children}
    </VisibleContext.Provider>
  )
}

export const useVisible = () => {
  if (!VisibleContext) {
    throw new Error('useVisible must be used within a VisibleProvider')
  }

  return useContext(VisibleContext)
}
