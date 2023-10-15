import { useNavigate } from '@solidjs/router'
import {
  Component,
  For,
  Show,
  createSignal,
  useContext,
  createEffect,
} from 'solid-js'
import { checkWeather, getFields } from '../utilities/FieldStore'
import { Header } from '../components/Header'
import { Page } from '../components/Page'
import { StatusLabel } from '../components/StatusLabel'
import { ChevronRightIcon } from '../assets/ChevronRightIcon.tsx'
import { Field } from '../utilities/types'
import { formatDate } from '../utilities/utils'
import styles from './FieldList.module.css'
import { VisibleContext } from '../components/VisibleProvider.tsx'
import { differenceInCalendarDays } from 'date-fns'
import { DaysLeftChip } from '../components/DaysLeftChip.tsx'

const groupFields = (fields: Field[]): { [groupName: string]: Field[] } => {
  // Group by "group"
  const groupedFields = fields.reduce(
    (acc: { [groupName: string]: Field[] }, field) => {
      if (!field.group) {
        acc.Other ? acc.Other.push(field) : (acc.Other = [field])
        return acc
      }

      if (!acc[field.group]) {
        acc[field.group] = []
      }
      acc[field.group].push(field)
      return acc
    },
    {},
  )

  // Sort the fields in each group by the number of days until the next predicted painting
  return Object.keys(groupedFields).reduce(
    (acc: { [groupName: string]: Field[] }, groupName) => {
      acc[groupName] = groupedFields[groupName].sort((a, b) =>
        differenceInCalendarDays(
          a.predictedNextPaint ?? new Date(),
          b.predictedNextPaint ?? new Date(),
        ),
      )
      return acc
    },
    {},
  )
}

const hitApi = async () => {
  await checkWeather()
}

export const FieldList: Component = () => {
  const navigate = useNavigate()
  const [groupedFields, setGroupedFields] = createSignal<{
    [groupName: string]: Field[]
  }>({ other: [] })

  const visible = useContext(VisibleContext)

  const onUpdateFields = (fields: Field[]) => {
    // Called when the actual network call returns
    setGroupedFields(groupFields(fields))
  }

  createEffect(() => {
    if (visible()) {
      setGroupedFields(groupFields(getFields(true, onUpdateFields)))
    }
  })

  return (
    <Page>
      <Header>Fields</Header>
      <ul class={styles.FieldList}>
        <For each={Object.keys(groupedFields()).sort()}>
          {(groupName) => (
            <>
              <div class={styles.GroupHeader}>
                <strong>{groupName}</strong>
              </div>
              <For
                each={groupedFields()[groupName]}
                fallback={
                  <div class={styles.EmptyList}>There are no fields</div>
                }
              >
                {(field: Field) => (
                  <li
                    class={styles.FieldItem}
                    onClick={() => navigate(field.id)}
                  >
                    <div>
                      <div>
                        <strong>
                          {field.name} ({field.size})
                        </strong>
                      </div>
                      <div class={styles.Description}>{field.description}</div>
                    </div>
                    <div class={styles.EndSlot}>
                      <div class={styles.StatusContainer}>
                        {/* Kind of a flaw of SolidJS: */}
                        <StatusLabel field={() => field} />
                        <div>
                          <Show when={field.predictedNextPaint}>
                            {formatDate(field.predictedNextPaint)}
                            <DaysLeftChip
                              predictedNextPaint={field.predictedNextPaint}
                            />
                          </Show>
                        </div>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </li>
                )}
              </For>
            </>
          )}
        </For>
      </ul>
      <div class={styles.ActionContainer}>
        <button onClick={() => navigate('new')}>+ Add Field</button>
        <button onClick={() => navigate('/quick')}>Quick Size</button>
        <button onClick={() => hitApi()}>API Test</button>
      </div>
    </Page>
  )
}
