import { useNavigate } from '@solidjs/router'
import { Component, useContext } from 'solid-js'
import { Header } from '../components/Header'
import { Page } from '../components/Page'
import { SupabaseContext } from '../components/SupabaseProvider'
import { TeamContext } from '../components/TeamProvider'

export const EditTeam: Component = () => {
  const { supabase } = useContext(SupabaseContext)
  const navigate = useNavigate()
  const team = useContext(TeamContext)

  const saveTeam = async (e) => {
    e.preventDefault()

    try {
      // Get all the values from the submitted form event e:
      const formData = new FormData(e.target)
      const data: {
        name: string
        zipcode?: string
        scheduleSheetUrl?: string
        scheduleSheetDateColumn?: string
        scheduleSheetFieldNameColumn?: string
      } = {}

      for (let pair of formData.entries()) {
        data[pair[0]] = pair[1]
      }

      await team?.save({
        name: data.name,
        zipcode: data.zipcode,
        scheduleSheetUrl: data.scheduleSheetUrl,
        scheduleSheetDateColumn: data.scheduleSheetDateColumn,
        scheduleSheetFieldNameColumn: data.scheduleSheetFieldNameColumn,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Page>
      <Header backLocation={`/fields`}>Edit Team</Header>
      <form onSubmit={saveTeam}>
        <label>
          Name:
          <input type="text" name="name" value={team?.name()} />
        </label>
        <label>
          Zip Code:
          <input type="text" name="zipcode" value={team?.zipcode()} />
        </label>
        <details>
          <summary>Team Members</summary>
          <ul>
            <li>Member 1</li>
            <li>Member 2</li>
          </ul>
        </details>
        <details>
          <summary>Schedule</summary>
          <label>
            Schedule Sheet URL:
            <input
              type="text"
              name="scheduleSheetUrl"
              value={team?.scheduleSheetUrl?.()}
            />
          </label>
          <label>
            Date Column:
            <input
              type="text"
              name="scheduleSheetDateColumn"
              value={team?.scheduleSheetDateColumn?.()}
            />
          </label>
          <label>
            Field Name Column:
            <input
              type="text"
              name="scheduleSheetFieldNameColumn"
              value={team?.scheduleSheetFieldNameColumn?.()}
            />
          </label>
        </details>
        <div class={styles.ActionBox}>
          <button
            type="button"
            class="secondary"
            onClick={() => navigate(`/fields`, { replace: true })}
          >
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </Page>
  )
}
