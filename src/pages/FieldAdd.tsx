import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
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
import { useOnlineStatus } from '../components/OnlineProvider'
import { SizeSlider } from '../components/SizeSlider'
import { useSupabase } from '../components/SupabaseProvider'
import { saveField } from '../utilities/actions'
import { SIZES } from '../utilities/constants'
import { getField, getUser } from '../utilities/data'
import { getDateFromPartialDate } from '../utilities/getDateFromPartialDate'
import { Field, FieldSize } from '../utilities/types'
import './FieldAdd.css'

export const FieldAdd = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [group, setGroup] = useState<string>()
  const [size, setSize] = useState<FieldSize>(FieldSize.full)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const [customWidth, setCustomWidth] = useState(
    SIZES[size].recommendedMaxWidth,
  )
  const [customLength, setCustomLength] = useState(
    SIZES[size].recommendedMaxLength,
  )
  const [lastPainted, setLastPainted] = useState<Date>()
  const form = useRef<any>()
  const { goBack, canGoBack, push } = useIonRouter()
  const { fieldId } = useParams<{ fieldId?: string }>()
  const currentField = useRef<Field>()
  const isOnline = useOnlineStatus()

  // Redirect to fields if we are offline
  useEffect(() => {
    if (!isOnline) {
      push('/fields')
    }
  }, [isOnline, push])

  useEffect(() => {
    if (fieldId) {
      // Load field
      getField({ supabase, id: fieldId }).then((field) => {
        console.log('loaded field ', field)
        currentField.current = field
        setName(field?.name ?? '')
        setDescription(field?.description ?? '')
        setGroup(field?.group ?? '')
        setSize((field?.size as FieldSize) ?? FieldSize.full)
        setCustomWidth(
          field?.customWidth ?? SIZES[FieldSize.full].recommendedMaxWidth,
        )
        setCustomLength(
          field?.customLength ?? SIZES[FieldSize.full].recommendedMaxLength,
        )
        setLastPainted(field?.lastPainted)
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
    e.preventDefault()
    ;(document.activeElement as HTMLInputElement)?.blur()

    try {
      const user = await getUser({ supabase })
      await saveField({
        field: {
          ...(currentField.current ?? {}),
          name,
          size,
          description,
          group,
          customWidth,
          customLength,
          paintTeamId: user.paintTeam.id,
          lastPainted,
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
          <IonTitle>{fieldId ? 'Edit' : 'Add'} Field</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/fields" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <FullLoader />
        ) : (
          <form onSubmit={onSave} ref={form}>
            {error && <IonText color="danger">{error}</IonText>}
            <IonItem>
              <IonInput
                label="Field Name"
                name="name"
                type="text"
                required
                value={name}
                onIonInput={(e) => setName(e.detail.value!)}
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
                value={description}
                onIonInput={(e) => setDescription(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Group"
                name="group"
                type="text"
                value={group}
                onIonInput={(e) => setGroup(e.detail.value!)}
              />
            </IonItem>
            <div className="slider-item">
              <IonInput
                label="Custom Width:"
                type="number"
                value={customWidth}
                onIonInput={(e) => setCustomWidth(Number(e.detail.value!))}
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
                onIonInput={(e) => setCustomLength(Number(e.detail.value!))}
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

            <div className="ion-padding">
              <details>
                <summary>Advanced Edits</summary>
                <IonInput
                  label="Last Painted"
                  type="date"
                  value={lastPainted?.toISOString().split('T')[0]}
                  onIonInput={(e) =>
                    setLastPainted(getDateFromPartialDate(e.detail.value))
                  }
                />
              </details>
            </div>

            <button type="submit" className="ion-hidden" />
          </form>
        )}
      </IonContent>

      <IonFooter translucent>
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
