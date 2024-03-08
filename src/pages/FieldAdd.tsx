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
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { FieldSketch } from '../components/FieldSketch'
import { FullLoader } from '../components/FullLoader'
import { SizeSlider } from '../components/SizeSlider'
import { useSupabase } from '../components/SupabaseProvider'
import { saveField } from '../utilities/actions'
import { SIZES } from '../utilities/constants'
import { getField, getUser } from '../utilities/data'
import { Field, FieldSize } from '../utilities/types'
import './FieldAdd.css'

export const FieldAdd = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState<FieldSize>(FieldSize.full)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const [customWidth, setCustomWidth] = useState(
    SIZES[size].recommendedMaxWidth,
  )
  const [customLength, setCustomLength] = useState(
    SIZES[size].recommendedMaxLength,
  )
  const form = useRef<any>()
  const { goBack, canGoBack, push } = useIonRouter()
  const { fieldId } = useParams<{ fieldId?: string }>()
  const currentField = useRef<Field>()

  useEffect(() => {
    if (fieldId) {
      // Load field
      getField({ supabase, id: fieldId }).then((field) => {
        console.log('loaded field ', field)
        currentField.current = field
        setSize((field?.size as FieldSize) ?? FieldSize.full)
        setCustomWidth(
          field?.customWidth ?? SIZES[FieldSize.full].recommendedMaxWidth,
        )
        setCustomLength(
          field?.customLength ?? SIZES[FieldSize.full].recommendedMaxLength,
        )
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [fieldId])

  const onSizeChange = (e: any) => {
    setSize(e.detail.value)
    setCustomLength(SIZES[e.detail.value].recommendedMaxLength)
    setCustomWidth(SIZES[e.detail.value].recommendedMaxWidth)
    ;(document.activeElement as HTMLInputElement)?.blur()
  }

  const submitForm = () => {
    setError(undefined)
    const valid = form.current?.checkValidity()
    if (valid) {
      form.current?.dispatchEvent(new Event('submit', { bubbles: true }))
    } else {
      form.current?.reportValidity()
    }
  }

  const onSave = async (e: any) => {
    console.log('Saving form')
    e.preventDefault()
    ;(document.activeElement as HTMLInputElement)?.blur()

    const formData = new FormData(e.target)

    try {
      const user = await getUser({ supabase })
      await saveField({
        field: {
          ...(currentField.current ?? {}),
          name: formData.get('name') as string,
          size: formData.get('size') as FieldSize,
          description: formData.get('description') as string,
          group: formData.get('group') as string,
          paintTeamId: user.paintTeam.id,
        },
        supabase,
      })

      if (canGoBack()) {
        goBack()
      } else {
        push('/fields')
      }
    } catch (err) {
      console.error(err)
      setError('Error saving field')
    }
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
      {loading ? (
        <FullLoader />
      ) : (
        <IonContent className="ion-padding">
          <form onSubmit={onSave} ref={form}>
            {error && <IonText color="danger">{error}</IonText>}
            <IonItem>
              <IonInput
                label="Field Name"
                name="name"
                type="text"
                required
                value={currentField.current?.name}
              />
            </IonItem>
            <IonItem className="ion-margin-bottom">
              <IonSelect
                label="Field Size"
                interface="popover"
                name="size"
                value={size}
                onIonChange={onSizeChange}
              >
                <IonSelectOption value={FieldSize.full}>Full</IonSelectOption>
                <IonSelectOption value={FieldSize.elevenThirteen}>
                  11/13
                </IonSelectOption>
                <IonSelectOption value={FieldSize.nineTen}>
                  9/10
                </IonSelectOption>
                <IonSelectOption value={FieldSize.sevenEight}>
                  7/8
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <div className="optional-heading">
              <IonLabel>Optional:</IonLabel>
            </div>
            <IonItem>
              <IonInput
                label="Description"
                name="description"
                type="text"
                value={currentField.current?.description ?? ''}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Group"
                name="group"
                type="text"
                value={currentField.current?.group ?? ''}
              />
            </IonItem>
            <div className="slider-item">
              <IonInput
                label="Custom Width:"
                type="number"
                value={customWidth}
                onIonChange={(e) => setCustomWidth(Number(e.detail.value!))}
                autocomplete="off"
              ></IonInput>
              <SizeSlider
                fieldSize={size}
                type="width"
                currentValue={customWidth}
              />
            </div>
            <div className="slider-item">
              <IonInput
                label="Custom Length:"
                type="number"
                value={customLength}
                onIonChange={(e) => setCustomLength(Number(e.detail.value!))}
                autocomplete="off"
              ></IonInput>
              <SizeSlider
                fieldSize={size}
                type="length"
                currentValue={customLength}
              />
            </div>
            <div className="ion-margin-top">
              <FieldSketch
                fieldSize={size}
                customLength={customLength}
                customWidth={customWidth}
              />
            </div>
            <button type="submit" className="ion-hidden" />
          </form>
        </IonContent>
      )}
      <IonFooter translucent collapse="fade">
        <IonToolbar>
          <IonButton
            type="button"
            slot="primary"
            onClick={submitForm}
            disabled={saving}
          >
            Save
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}
