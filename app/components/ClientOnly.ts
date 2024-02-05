import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react'

// We can safely track hydration in memory state
// outside of the component because it is only
// updated once after the version instance of
// `SomeComponent` has been hydrated. From there,
// the browser takes over rendering duties across
// route changes and we no longer need to worry
// about hydration mismatches until the page is
// reloaded and `isHydrating` is reset to true.
let isHydrating = true

export const ClientOnly: FC<PropsWithChildren<{ fallback?: ReactNode }>> = ({
  children,
  fallback,
}) => {
  const [isHydrated, setIsHydrated] = useState(!isHydrating)

  useEffect(() => {
    isHydrating = false
    setIsHydrated(true)
  }, [])

  return isHydrated ? children : fallback ?? null
}
