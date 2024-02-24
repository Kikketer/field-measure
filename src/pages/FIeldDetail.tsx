import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSkeletonText,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { getField } from '../data/fields'
import { SIZES } from '../utilities/constants'
import { Field, FieldSize } from '../utilities/types'
import './FieldDetail.css'

export const FieldDetail = () => {
  const [loading, setLoading] = useState(false)
  const [field, setField] = useState<Field>()
  const params = useParams<{ id: string }>()

  useIonViewWillEnter(() => {
    getField(params.id).then((foundField) => {
      setField(foundField)
    })
  })

  return (
    <IonPage id="field-detail-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Fields" defaultHref="/fields"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <FieldDetailSkeleton />
        ) : (
          <>
            {field ? (
              <>
                <div className="ion-padding">
                  <IonItem lines="none" style={{ alignItems: 'start' }}>
                    <IonLabel>
                      <h1>{field.name}</h1>
                      <IonNote>{field.description}</IonNote>
                    </IonLabel>
                    <IonLabel slot="end">
                      Status
                      {/*<StatusLabel field={thisField} />*/}
                    </IonLabel>
                  </IonItem>
                  <IonList>
                    <IonItem>
                      <strong>Last painted:</strong>
                      {field.lastPainted.toLocaleDateString()}
                    </IonItem>
                    <IonItem>
                      <strong>Predicted next painting:</strong>
                      {field.predictedNextPaint?.toLocaleDateString()}
                      <div>10</div>
                      {/*<DaysLeftChip*/}
                      {/*  predictedNextPaint={field.predictedNextPaint}*/}
                      {/*  lastPainted={field.lastPainted}*/}
                      {/*/>*/}
                    </IonItem>
                    <IonItem>
                      <strong>Size:</strong>
                      {field.size} (
                      {field.customLength ??
                        SIZES[field.size ?? FieldSize.full]
                          ?.recommendedMaxLength}
                      L x{' '}
                      {field.customWidth ??
                        SIZES[field.size ?? FieldSize.full]
                          ?.recommendedMaxWidth}
                      W)
                    </IonItem>
                    {!!field.group && (
                      <IonItem>
                        <strong>Group:</strong>
                        {field.group}
                      </IonItem>
                    )}
                  </IonList>
                  <details>
                    <summary>Details</summary>
                    <div>
                      <ul>
                        <li>
                          <strong>Max dry days:</strong>&nbsp;{field.maxDryDays}
                        </li>
                        <li>
                          <strong>Rainfall days:</strong>&nbsp;
                          {field.rainfallDays}
                        </li>
                        <li>
                          <strong>Rainfall factor:</strong>&nbsp;
                          {Math.floor((field.rainfallFactor ?? 0) * 1000) /
                            1000}
                        </li>
                      </ul>
                      <div>Field Draw</div>
                      {/*<Field*/}
                      {/*  fieldSize={() => field.size as FieldSize}*/}
                      {/*  customLength={() => field.customLength}*/}
                      {/*  customWidth={() => field.customWidth}*/}
                      {/*/>*/}
                    </div>
                  </details>
                  {/*<div>*/}
                  {/*  <button*/}
                  {/*    onClick={() => setShowConfirmPaint(true)}*/}
                  {/*    disabled={*/}
                  {/*      !isOnline?.() ||*/}
                  {/*      differenceInCalendarDays(*/}
                  {/*        new Date(),*/}
                  {/*        field.lastPainted ?? new Date(),*/}
                  {/*      ) < 3*/}
                  {/*    }*/}
                  {/*  >*/}
                  {/*    Mark Painted*/}
                  {/*  </button>*/}
                  {/*</div>*/}
                  {/*<ConfirmPaint*/}
                  {/*  show={showConfirmPaint}*/}
                  {/*  daysRemaining={() =>*/}
                  {/*    differenceInCalendarDays(*/}
                  {/*      field.predictedNextPaint ?? new Date(),*/}
                  {/*      new Date(),*/}
                  {/*    )*/}
                  {/*  }*/}
                  {/*  reasonableLimitOfOverdueDays={() =>*/}
                  {/*    (field.maxDryDays ?? 0) * 2*/}
                  {/*  }*/}
                  {/*  onPaint={paintField}*/}
                  {/*  onCancel={() => setShowConfirmPaint(false)}*/}
                  {/*/>*/}
                </div>
              </>
            ) : (
              <div>Field not found</div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

const FieldDetailSkeleton = () => {
  return <IonSkeletonText animated={true} style={{ width: 80 }} />
}
