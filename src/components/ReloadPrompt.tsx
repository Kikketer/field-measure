import { IonButton } from '@ionic/react'
import React, { useEffect, useRef } from 'react'
import './ReloadPrompt.css'

// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useVisible } from './VisibleProvider'

function ReloadPrompt() {
  const isVisible = useVisible()
  const registration = useRef<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (isVisible && registration.current) {
      registration.current?.update?.()
    }
  }, [isVisible])

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(r: ServiceWorkerRegistration) {
      console.log('SW Registered', r)
      registration.current = r
    },
    onRegisterError(error: Error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            {offlineReady ? (
              <span>You can add this app to your home screen!</span>
            ) : (
              <span>
                New content available, click on reload button to update.
              </span>
            )}
          </div>
          <div className="ReloadPrompt-buttons">
            <IonButton size="small" fill="outline" onClick={() => close()}>
              Close
            </IonButton>
            {needRefresh && (
              <IonButton size="small" onClick={() => updateServiceWorker(true)}>
                Reload
              </IonButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReloadPrompt
