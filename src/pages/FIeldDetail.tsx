import {
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
import { createOutline } from 'ionicons/icons'
import { differenceInCalendarDays } from 'date-fns'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { ConfirmPaint } from '../components/ConfirmPaint'
import { FieldSketch } from '../components/FieldSketch'
import { StatusLabel } from '../components/StatusLabel'
import { useSupabase } from '../components/SupabaseProvider'
import { paintField } from '../utilities/actions'
import { SIZES } from '../utilities/constants'
import { getField, getUser } from '../utilities/data'
import {
  getColorAtPercentage,
  getColorContrast,
  getPercentage,
} from '../utilities/percentageColors'
import { Field, FieldSize, User } from '../utilities/types'
import './FieldDetail.css'

export const FieldDetail = () => {
  const [loading, setLoading] = useState(false)
  const [showConfirmPaint, setShowConfirmPaint] = useState(false)
  const [field, setField] = useState<Field>()
  const [user, setUser] = useState<User>()
  const params = useParams<{ id: string }>()
  const { supabase } = useSupabase()

  useIonViewWillEnter(() => {
    setLoading(true)
    getField({ supabase, id: params.id }).then((foundField) => {
      setField(foundField)
      setLoading(false)
    })
    getUser({ supabase }).then((foundUser) => {
      setUser(foundUser)
    })
  })

  const onPaint = async ({ adjustFactor }: { adjustFactor: boolean }) => {
    if (!field) return
    const resultingField = await paintField({ field, adjustFactor, supabase })
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
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Fields" defaultHref="/fields"></IonBackButton>
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
                            background: getColorAtPercentage(percentage),
                            color: getColorContrast(percentage),
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
          <IonButton
            slot="primary"
            onClick={() => setShowConfirmPaint(true)}
            fill={
              differenceInCalendarDays(
                new Date(),
                field?.lastPainted ?? new Date(),
              ) < 3
                ? 'outline'
                : 'solid'
            }
            disabled={
              differenceInCalendarDays(
                new Date(),
                field?.lastPainted ?? new Date(),
              ) < 3 || !user
            }
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
        onPaint={onPaint}
        reasonableLimitOfOverdueDays={(field?.maxDryDays || 12) * 2}
        onCancel={() => setShowConfirmPaint(false)}
      />
    </IonPage>
  )
}

const FieldDetailSkeleton = () => {
  return (
    <div className="ion-padding">
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
          <tr>
            <td>
              <IonLabel style={{ fontWeight: 'bold' }}>Predicted</IonLabel>
            </td>
            <td>
              <IonSkeletonText animated={true} style={{ width: '5rem' }} />
            </td>
          </tr>
          <tr>
            <td>
              <IonLabel style={{ fontWeight: 'bold' }}>Last painted</IonLabel>
            </td>
            <td>
              <IonSkeletonText animated={true} style={{ width: '5rem' }} />
            </td>
          </tr>
          <tr>
            <td>
              <IonLabel style={{ fontWeight: 'bold' }}>Size</IonLabel>
            </td>
            <td>
              <IonSkeletonText animated={true} style={{ width: '5rem' }} />
            </td>
          </tr>
          <tr>
            <td>
              <IonLabel style={{ fontWeight: 'bold' }}>Max dry days</IonLabel>
            </td>
            <td>
              <IonSkeletonText animated={true} style={{ width: '5rem' }} />
            </td>
          </tr>
          <tr>
            <td>
              <IonLabel style={{ fontWeight: 'bold' }}>Rainfall days</IonLabel>
            </td>
            <td>
              <IonSkeletonText animated={true} style={{ width: '5rem' }} />
            </td>
          </tr>
          <tr>
            <td>
              <IonLabel style={{ fontWeight: 'bold' }}>
                Rainfall factor
              </IonLabel>
            </td>
            <td>
              <IonSkeletonText animated={true} style={{ width: '5rem' }} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
