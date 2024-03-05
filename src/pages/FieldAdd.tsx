import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'
import { SizeSlider } from '../components/SizeSlider'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import './FieldAdd.css'

export const FieldAdd = () => {
  const [size, setSize] = useState<FieldSize>(FieldSize.full)
  const [customWidth, setCustomWidth] = useState(
    SIZES[size].recommendedMaxWidth,
  )
  const [customLength, setCustomLength] = useState(
    SIZES[size].recommendedMaxLength,
  )

  const onSizeChange = (e: any) => {
    setSize(e.detail.value)
    setCustomLength(SIZES[e.detail.value].recommendedMaxLength)
    setCustomWidth(SIZES[e.detail.value].recommendedMaxWidth)
    ;(document.activeElement as HTMLInputElement)?.blur()
  }

  const onSave = (e: any) => {
    e.preventDefault()
    ;(document.activeElement as HTMLInputElement)?.blur()
  }

  return (
    <IonPage id="add-field">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Field</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/fields" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={onSave}>
          <IonItem>
            <IonInput label="Field Name" name="name" type="text" required />
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonSelect
              label="Field Size"
              interface="popover"
              name="size"
              defaultValue={FieldSize.full}
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
          </IonItem>
          <IonItemDivider>
            <IonLabel>Optional:</IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonInput label="Description" name="description" type="text" />
          </IonItem>
          <IonItem>
            <IonInput label="Group" name="group" type="text" />
          </IonItem>
          <div className="slider-item">
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
          <div className="slider-item">
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
          <button type="submit" className="ion-hidden" />
        </form>
      </IonContent>
      <IonFooter translucent collapse="fade">
        <IonToolbar>
          <IonButton type="button" slot="primary">
            Save
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}
