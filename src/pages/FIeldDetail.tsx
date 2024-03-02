import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'
import { differenceInCalendarDays } from 'date-fns'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { ConfirmPaint } from '../components/ConfirmPaint'
import { DaysLeftChip } from '../components/DaysLeftChip'
import { FieldSketch } from '../components/FieldSketch'
import { useSupabase } from '../components/SupabaseProvider'
import { SIZES } from '../utilities/constants'
import { getField } from '../utilities/data'
import { Field, FieldSize } from '../utilities/types'
import './FieldDetail.css'
import { StatusLabel } from '../components/StatusLabel'

export const FieldDetail = () => {
  const isOnline = true
  const [loading, setLoading] = useState(false)
  const [showConfirmPaint, setShowConfirmPaint] = useState(false)
  const [field, setField] = useState<Field>()
  const params = useParams<{ id: string }>()
  const { supabase } = useSupabase()

  useIonViewWillEnter(() => {
    getField({ supabase, id: params.id }).then((foundField) => {
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
          {!loading && field && <IonTitle>{field.name}</IonTitle>}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <FieldDetailSkeleton />
        ) : (
          <>
            {field ? (
              <>
                <IonHeader collapse="condense">
                  <IonToolbar>
                    <IonTitle size="large">{field.name}</IonTitle>
                  </IonToolbar>
                </IonHeader>
                <div className="ion-padding col gap-4">
                  <IonItem lines="none" style={{ alignItems: 'start' }}>
                    <IonLabel>
                      <IonNote>{field.description}</IonNote>
                    </IonLabel>
                    <IonLabel slot="end">
                      <StatusLabel field={field} />
                    </IonLabel>
                  </IonItem>

                  <table aria-description="Field information">
                    <tbody>
                      <tr>
                        <td>
                          <IonLabel style={{ fontWeight: 'bold' }}>
                            Predicted
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            {field.predictedNextPaint?.toLocaleDateString()} (
                            {differenceInCalendarDays(
                              new Date(field.predictedNextPaint ?? new Date()),
                              new Date(),
                            )}
                            )
                          </IonLabel>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <IonLabel style={{ fontWeight: 'bold' }}>
                            Last painted
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            {field.lastPainted.toLocaleDateString()}
                          </IonLabel>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <IonLabel style={{ fontWeight: 'bold' }}>
                            Size
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            {field.size} (
                            {field.customLength ??
                              SIZES[field.size ?? FieldSize.full]
                                ?.recommendedMaxLength}
                            L x{' '}
                            {field.customWidth ??
                              SIZES[field.size ?? FieldSize.full]
                                ?.recommendedMaxWidth}
                            W)
                          </IonLabel>
                        </td>
                      </tr>
                      {!!field.group && (
                        <tr>
                          <td>
                            <IonLabel style={{ fontWeight: 'bold' }}>
                              Group
                            </IonLabel>
                          </td>
                          <td>
                            <IonLabel slot="end">{field.group}</IonLabel>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>
                          <IonLabel style={{ fontWeight: 'bold' }}>
                            Max dry days
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            {field.maxDryDays} days
                          </IonLabel>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <IonLabel style={{ fontWeight: 'bold' }}>
                            Rainfall days
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            {field.rainfallDays} days
                          </IonLabel>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <IonLabel style={{ fontWeight: 'bold' }}>
                            Rainfall factor
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            {Math.floor((field.rainfallFactor ?? 0) * 1000) /
                              1000}
                          </IonLabel>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <FieldSketch
                    fieldSize={field.size as FieldSize}
                    customLength={field.customLength}
                    customWidth={field.customWidth}
                  />
                </div>
              </>
            ) : (
              <div>Field not found</div>
            )}
          </>
        )}
      </IonContent>
      <IonFooter translucent collapse="fade">
        <IonToolbar>
          <IonButton
            slot="primary"
            onClick={() => setShowConfirmPaint(true)}
            // disabled={
            //   !isOnline ||
            //   differenceInCalendarDays(
            //     new Date(),
            //     field.lastPainted ?? new Date(),
            //   ) < 3
            // }
          >
            Mark Painted
          </IonButton>
        </IonToolbar>
      </IonFooter>
      <ConfirmPaint
        show={showConfirmPaint}
        daysRemaining={differenceInCalendarDays(
          new Date(field?.predictedNextPaint ?? new Date()),
          new Date(),
        )}
        onPaint={() => {}}
        reasonableLimitOfOverdueDays={(field?.maxDryDays || 12) * 2}
        onCancel={() => setShowConfirmPaint(false)}
      />
    </IonPage>
  )
}

const FieldDetailSkeleton = () => {
  return <IonSkeletonText animated={true} style={{ width: 80 }} />
}
