import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
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
import { createOutline } from 'ionicons/icons'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { ConfirmPaint } from '../components/ConfirmPaint'
import { ConfirmUnplayable } from '../components/ConfirmUnplayable'
import { FieldSketch } from '../components/FieldSketch'
import { StatusLabel } from '../components/StatusLabel'
import { useSupabase } from '../components/SupabaseProvider'
import { useVisible } from '../components/VisibleProvider'
import { markFieldUnplayable, mowField, paintField } from '../utilities/actions'
import { SIZES } from '../utilities/constants'
import { getField, getUser } from '../utilities/data'
import {
  getColorAtPercentage,
  getColorContrast,
  getPercentage,
} from '../utilities/percentageColors'
import { Field, FieldSize, User } from '../utilities/types'
import './FieldDetail.css'

const THROTTLE_TIME = 500

export const FieldDetail = () => {
  const [loading, setLoading] = useState(false)
  const [showConfirmPaint, setShowConfirmPaint] = useState(false)
  const [showConfirmMow, setShowConfirmMow] = useState(false)
  const [showConfirmUnplayable, setShowConfirmUnplayable] = useState(false)
  const [field, setField] = useState<Field>()
  const [user, setUser] = useState<User>()
  const params = useParams<{ id: string }>()
  const { supabase } = useSupabase()
  const isVisible = useVisible()
  const throttleTimer = useRef<any | undefined>()

  const fetch = async () => {
    if (throttleTimer.current) return

    getField({ supabase, id: params.id })
      .then((foundField) => {
        setField(foundField)
      })
      .finally(() => setLoading(false))
    getUser({ supabase }).then((foundUser) => {
      setUser(foundUser)
    })

    throttleTimer.current = setTimeout(() => {
      clearTimeout(throttleTimer.current)
      throttleTimer.current = undefined
    }, THROTTLE_TIME)
  }

  useIonViewWillEnter(() => {
    setLoading(true)
    fetch().catch((err) => console.error(err))
  })

  useEffect(() => {
    if (isVisible) {
      fetch().catch((err) => console.error(err))
    }
  }, [isVisible])

  const onPaint = async ({ adjustFactor }: { adjustFactor: boolean }) => {
    if (!field) return
    const resultingField = await paintField({ field, adjustFactor, supabase })
    setField(resultingField)
  }

  const onMow = async () => {
    if (!field) return
    const resultingField = await mowField({ field, supabase })
    setField(resultingField)
  }

  const onMarkUnplayable = async () => {
    if (!field) return

    console.log('marking unplayable')
    const resultingField = await markFieldUnplayable({
      field,
      supabase,
      unplayableOn: new Date(),
    })
    setField(resultingField)
  }

  const percentage = useMemo(() => {
    if (field) {
      return getPercentage({
        predictedNextPaint: field?.predictedNextPaint,
        lastPainted: field?.lastPainted,
      })
    }
  }, [field])

  return (
    <IonPage id="field-detail-page">
      <IonHeader translucent>
        {loading ? null : (
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                text="Fields"
                defaultHref="/fields"
              ></IonBackButton>
            </IonButtons>
            {!loading && field && <IonTitle>{field.name}</IonTitle>}
            <IonButtons slot="end">
              <IonButton
                aria-label="Edit Field"
                routerLink={`/field/${params.id}/edit`}
              >
                <IonIcon icon={createOutline} aria-hidden="true" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        )}
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
                        <td
                          style={{
                            background: getColorAtPercentage(percentage ?? 0),
                            color: getColorContrast(percentage ?? 0),
                            borderTopRightRadius: 'var(--border-radius)',
                          }}
                        >
                          <IonLabel>
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
                            Last mowed
                          </IonLabel>
                        </td>
                        <td>
                          <IonLabel slot="end">
                            {field.lastMowed && (
                              <>
                                {differenceInCalendarDays(
                                  new Date(),
                                  field.lastMowed ?? new Date(),
                                )}{' '}
                                days ago
                              </>
                            )}
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
      <IonFooter translucent>
        <IonToolbar>
          {/* Come back to this feature when you adjust the factor in the db to use the unplayable date */}
          {/*<IonButton*/}
          {/*  slot="secondary"*/}
          {/*  fill="outline"*/}
          {/*  onClick={() => setShowConfirmUnplayable(true)}*/}
          {/*  disabled={*/}
          {/*    differenceInCalendarDays(*/}
          {/*      new Date(),*/}
          {/*      field?.lastPainted ?? new Date('2024-01-01'),*/}
          {/*    ) < 3 ||*/}
          {/*    // If the predicted next paint is WAAAY in the past, then disable*/}
          {/*    differenceInCalendarDays(*/}
          {/*      new Date(field?.predictedNextPaint ?? new Date()),*/}
          {/*      new Date(),*/}
          {/*    ) <*/}
          {/*      -(field?.maxDryDays || 12) * 2 ||*/}
          {/*    !user*/}
          {/*  }*/}
          {/*>*/}
          {/*  Unplayable*/}
          {/*</IonButton>*/}
          <IonButton
            slot="primary"
            onClick={() => setShowConfirmMow(true)}
            fill={
              differenceInCalendarDays(
                new Date(),
                field?.lastMowed ?? new Date('2024-01-01'),
              ) < 3
                ? 'outline'
                : 'solid'
            }
            disabled={
              differenceInCalendarDays(
                new Date(),
                field?.lastMowed ?? new Date('2024-01-01'),
              ) < 3 || !user
            }
          >
            Mow
          </IonButton>
          <IonButton
            slot="primary"
            onClick={() => setShowConfirmPaint(true)}
            fill={
              differenceInCalendarDays(
                new Date(),
                field?.lastPainted ?? new Date('2024-01-01'),
              ) < 3
                ? 'outline'
                : 'solid'
            }
            disabled={
              differenceInCalendarDays(
                new Date(),
                field?.lastPainted ?? new Date('2024-01-01'),
              ) < 3 || !user
            }
          >
            Paint
          </IonButton>
        </IonToolbar>
      </IonFooter>
      <ConfirmPaint
        show={showConfirmPaint}
        daysRemaining={differenceInCalendarDays(
          new Date(field?.predictedNextPaint ?? new Date()),
          new Date(),
        )}
        onPaint={onPaint}
        reasonableLimitOfOverdueDays={(field?.maxDryDays || 12) * 2}
        onCancel={() => setShowConfirmPaint(false)}
      />
      <IonAlert
        isOpen={showConfirmMow}
        header="Confirm Mowing"
        onDidDismiss={() => setShowConfirmMow(false)}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Mark Mowed',
            role: 'confirm',
            handler: () => {
              onMow()
            },
          },
        ]}
      />
      <ConfirmUnplayable
        show={showConfirmUnplayable}
        daysRemaining={differenceInCalendarDays(
          new Date(field?.predictedNextPaint ?? new Date()),
          new Date(),
        )}
        onMarkUnplayable={onMarkUnplayable}
        onCancel={() => setShowConfirmUnplayable(false)}
      />
    </IonPage>
  )
}

const FieldDetailSkeleton = () => {
  return (
    <div className="ion-padding" style={{ marginTop: '2rem' }}>
      <IonSkeletonText
        animated={true}
        style={{ height: '2rem', width: '50%', marginBottom: '3rem' }}
      />
      <IonSkeletonText
        animated={true}
        style={{ height: '1rem', width: '50%', marginBottom: '2rem' }}
      />
      <table aria-description="Field information">
        <tbody>
          {new Array(7).fill('').map((_, i) => (
            <tr key={i}>
              <td>
                <IonSkeletonText animated={true} style={{ width: '5rem' }} />
              </td>
              <td>
                <IonSkeletonText animated={true} style={{ width: '5rem' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
