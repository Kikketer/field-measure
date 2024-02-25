import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { ConfirmPaint } from '../components/ConfirmPaint'
import { getField } from '../data/fields'
import { SIZES } from '../utilities/constants'
import { Field, FieldSize } from '../utilities/types'
import './FieldDetail.css'

export const FieldDetail = () => {
  const isOnline = true
  const [loading, setLoading] = useState(false)
  const [showConfirmPaint, setShowConfirmPaint] = useState(false)
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

                  <table aria-description="Field information">
                    <tbody>
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
                            Predicted
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            10
                            {/*{field.predictedNextPaint?.toLocaleDateString()}*/}
                          </IonLabel>
                          {/*<DaysLeftChip*/}
                          {/*  predictedNextPaint={field.predictedNextPaint}*/}
                          {/*  lastPainted={field.lastPainted}*/}
                          {/*/>*/}
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
                          <IonLabel slot="end">{field.maxDryDays}</IonLabel>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <IonLabel style={{ fontWeight: 'bold' }}>
                            Rainfall days
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">{field.rainfallDays}</IonLabel>
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
                  <div>
                    <div>Field Draw</div>
                    {/*<Field*/}
                    {/*  fieldSize={() => field.size as FieldSize}*/}
                    {/*  customLength={() => field.customLength}*/}
                    {/*  customWidth={() => field.customWidth}*/}
                    {/*/>*/}
                  </div>
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
      <IonFooter
        className="ion-padding"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <IonButton
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
        <ConfirmPaint
          show={showConfirmPaint}
          daysRemaining={10}
          onPaint={() => {}}
          reasonableLimitOfOverdueDays={10}
          onCancel={() => setShowConfirmPaint(false)}
        />
        {/*<IonAlert*/}
        {/*  isOpen={showConfirmPaint}*/}
        {/*  header="A Short Title Is Best"*/}
        {/*  subHeader="A Sub Header Is Optional"*/}
        {/*  message="A message should be a short, complete sentence."*/}
        {/*  buttons={[*/}
        {/*    {*/}
        {/*      text: 'Cancel',*/}
        {/*      role: 'cancel',*/}
        {/*      handler: () => {*/}
        {/*        console.log('Alert canceled')*/}
        {/*      },*/}
        {/*    },*/}
        {/*    {*/}
        {/*      text: 'Was playable until yesterday',*/}
        {/*      handler: () => {*/}
        {/*        console.log('Alert canceled')*/}
        {/*      },*/}
        {/*    },*/}
        {/*    {*/}
        {/*      text: 'Mark Painted',*/}
        {/*      role: 'confirm',*/}
        {/*      handler: () => {*/}
        {/*        console.log('Alert confirmed')*/}
        {/*      },*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*  onDidDismiss={() => setShowConfirmPaint(false)}*/}
        {/*></IonAlert>*/}
      </IonFooter>
    </IonPage>
  )
}

const FieldDetailSkeleton = () => {
  return <IonSkeletonText animated={true} style={{ width: 80 }} />
}
