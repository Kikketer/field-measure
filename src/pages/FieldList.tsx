import { useNavigate } from '@solidjs/router'
import {
  Component,
  For,
  Show,
  createMemo,
  createSignal,
  useContext,
} from 'solid-js'
import { getFields } from '../utilities/FieldStore'
import { Header } from '../components/Header'
import { OnlineContext, OnlineStatus } from '../components/OnlineStatusProvider'
import { Page } from '../components/Page'
import { StatusLabel } from '../components/StatusLabel'
import { ChevronRight } from '../components/chevron-right'
import { Field } from '../utilities/types'
import {
  formatDate,
  getPredictedDaysUntilPaint,
  getPredictedNextPaintDate,
  getPredictedNextPaintLabel,
} from '../utilities/utils'
import styles from './FieldList.module.css'

const groupFields = (fields: Field[]): { [groupName: string]: Field[] } => {
  // Group by "group"
  return fields.reduce((acc: { [groupName: string]: Field[] }, field) => {
    if (!field.group) {
      acc.Other ? acc.Other.push(field) : (acc.Other = [field])
      return acc
    }

    if (!acc[field.group]) {
      acc[field.group] = []
    }
    acc[field.group].push(field)
    return acc
  }, {})
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

  setGroupedFields(
    createMemo(() => groupFields(getFields(isOnline?.(), onUpdateFields))),
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
                            {getPredictedNextPaintLabel(
                              getPredictedNextPaintDate(field),
                            )}{' '}
                            {formatDate(getPredictedNextPaintDate(field))} [
                            {getPredictedDaysUntilPaint(field)}]
                          </Show>
                        </div>
                      </div>
                      <ChevronRight />
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
      </div>
      <OnlineStatus />
    </Page>
  )
}
