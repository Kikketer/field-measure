import { IonButton } from '@ionic/react'
import React, { useEffect, useRef } from 'react'
import './ReloadPrompt.css'

const intervalMS = 60 * 60 * 1000

// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string, r: ServiceWorkerRegistration) {
      console.log('SW Registered 3', r)
      // From: https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html#handling-edge-cases
      r &&
        setInterval(async () => {
          if (!(!r.installing && navigator)) return

          if ('connection' in navigator && !navigator.onLine) return

          const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
              cache: 'no-store',
              'cache-control': 'no-cache',
            },
          })

          if (resp?.status === 200) await r.update()
        }, intervalMS)
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
