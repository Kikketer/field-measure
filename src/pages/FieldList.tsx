import { useNavigate } from '@solidjs/router'
import {
  Component,
  createEffect,
  createSignal,
  For,
  Show,
  useContext,
} from 'solid-js'
import { ChevronRightIcon } from '../assets/ChevronRightIcon'
import { DaysLeftChip } from '../components/DaysLeftChip'
import { Header } from '../components/Header'
import { Page } from '../components/Page'
import { SettingsDrawer } from '../components/SettingsDrawer'
import { StatusLabel } from '../components/StatusLabel'
import { FieldsContext } from '../providers/FieldsProvider'
import { OnlineContext } from '../providers/OnlineStatusProvider'
import { Field } from '../utilities/types'
import { formatDate } from '../utilities/utils'
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
  const navigate = useNavigate()
  const [groupedFields, setGroupedFields] = createSignal<{
    [groupName: string]: Field[]
  }>({ other: [] })
  const isOnline = useContext(OnlineContext)
  const { fields, fetchFields } = useContext(FieldsContext)
  const [isShowingDrawer, setIsShowingDrawer] = createSignal(false)

  // Fetch the fields when we navigate to this page:
  fetchFields()

  createEffect(() => {
    setGroupedFields(groupFields(fields?.()))
  })

  return (
    <Page>
      <Header withMenu={true} setIsShowingDrawer={setIsShowingDrawer}>
        Fields
      </Header>
      <SettingsDrawer
        isShown={isShowingDrawer}
        setIsShowingDrawer={setIsShowingDrawer}
      />
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
                        <div class={styles.DateRow}>
                          <Show when={field.predictedNextPaint}>
                            {formatDate(field.predictedNextPaint)}
                            <DaysLeftChip
                              predictedNextPaint={field.predictedNextPaint}
                              lastPainted={field.lastPainted}
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
        <button onClick={() => navigate('new')} disabled={!isOnline?.()}>
          + Add Field
        </button>
        <button onClick={() => navigate('/quick')}>Quick Size</button>
      </div>
    </Page>
  )
}
