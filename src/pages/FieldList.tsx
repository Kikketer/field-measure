import { useNavigate } from '@solidjs/router'
import {
  Component,
  For,
  Show,
  createMemo,
  createSignal,
  useContext,
} from 'solid-js'
import { checkWeather, getFields } from '../utilities/FieldStore'
import { Header } from '../components/Header'
import { OnlineContext, OnlineStatus } from '../components/OnlineStatusProvider'
import { Page } from '../components/Page'
import { StatusLabel } from '../components/StatusLabel'
import { ChevronRightIcon } from '../assets/ChevronRightIcon.tsx'
import { Field } from '../utilities/types'
import {
  formatDate,
  getPredictedNextPaintDate,
  getPredictedNextPaintLabel,
} from '../utilities/utils'
import { getPredictedDaysUntilPaint } from '../utilities/calculateConditions.ts'
import styles from './FieldList.module.css'

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
      acc[groupName] = groupedFields[groupName].sort(
        (a, b) =>
          (getPredictedDaysUntilPaint(a) ?? 0) -
          (getPredictedDaysUntilPaint(b) ?? 0),
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
  const isOnline = useContext(OnlineContext)
  const navigate = useNavigate()
  const [groupedFields, setGroupedFields] = createSignal<{
    [groupName: string]: Field[]
  }>({ other: [] })

  const onUpdateFields = (fields: Field[]) => {
    // Called when the actual network call returns
    setGroupedFields(groupFields(fields))
  }

  // Get fields but because our wrapper handles this while we are focused,
  // we send false to the getFields to pull the cache instead
  setGroupedFields(
    createMemo(() => groupFields(getFields(false, onUpdateFields))),
  )

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
                {(field) => (
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
                        <StatusLabel field={field} />
                        <div>
                          <Show when={getPredictedNextPaintDate(field)}>
                            {formatDate(getPredictedNextPaintDate(field))} [
                            {getPredictedDaysUntilPaint(field)}]
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
