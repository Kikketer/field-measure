import { IonContent, IonSpinner } from '@ionic/react'

export const FullLoader = () => {
  return (
    <IonContent fullscreen>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <IonSpinner />
      </div>
    </IonContent>
  )
}
