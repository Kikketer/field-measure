import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useState } from 'react'
import { FieldSketch } from '../components/FieldSketch'
import { SizeSlider } from '../components/SizeSlider'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import './Quick.css'

export const Quick = () => {
  const [size, setSize] = useState<FieldSize>(FieldSize.full)
  const [customWidth, setCustomWidth] = useState(
    SIZES[size].recommendedMaxWidth,
  )
  const [customLength, setCustomLength] = useState(
    SIZES[size].recommendedMaxLength,
  )

  const swallowFormEvents = (e: any) => {
    e.preventDefault()
    ;(document.activeElement as HTMLInputElement)?.blur()
  }

  const onSizeChange = (e: any) => {
    setSize(e.detail.value)
    setCustomLength(SIZES[e.detail.value].recommendedMaxLength)
    setCustomWidth(SIZES[e.detail.value].recommendedMaxWidth)
    ;(document.activeElement as HTMLInputElement)?.blur()
  }

  return (
    <IonPage id="quick-field">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Quick Field</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/fields" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Field {size}</h2>
        <FieldSketch
          fieldSize={size}
          customLength={customLength}
          customWidth={customWidth}
        />
        <form onSubmit={swallowFormEvents} className="ion-padding-horizontal">
          <div>
            <IonSelect
              label="Field Size"
              interface="popover"
              value={size}
              onIonChange={onSizeChange}
            >
              <IonSelectOption value={FieldSize.full}>Full</IonSelectOption>
              <IonSelectOption value={FieldSize.elevenThirteen}>
                11/13
              </IonSelectOption>
              <IonSelectOption value={FieldSize.nineTen}>9/10</IonSelectOption>
              <IonSelectOption value={FieldSize.sevenEight}>
                7/8
              </IonSelectOption>
            </IonSelect>
          </div>
          <div>
            <IonInput
              label="Custom Width:"
              type="number"
              value={customWidth}
              onIonChange={(e) => setCustomWidth(Number(e.detail.value!))}
              defaultValue={SIZES[size].recommendedMaxWidth}
              autocomplete="off"
            ></IonInput>
            <SizeSlider
              fieldSize={size}
              type="width"
              currentValue={customWidth}
            />
          </div>
          <div>
            <IonInput
              label="Custom Length:"
              type="number"
              value={customLength}
              onIonChange={(e) => setCustomLength(Number(e.detail.value!))}
              defaultValue={SIZES[size].recommendedMaxLength}
              autocomplete="off"
            ></IonInput>
            <SizeSlider
              fieldSize={size}
              type="length"
              currentValue={customLength}
            />
          </div>
          <button type="submit" className="ion-hide">
            Save
          </button>
        </form>
      </IonContent>
    </IonPage>
  )
}
