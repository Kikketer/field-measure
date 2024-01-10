import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createSignal,
  JSX,
  useContext,
} from 'solid-js'
import { PaintTeam } from '../utilities/types'
import { AuthenticationContext } from './AuthenticationProvider'

export const TeamContext = createContext<{
  name: Accessor<string>
  zipcode: Accessor<string>
  scheduleSheetUrl?: Accessor<string>
  scheduleSheetDateColumn?: Accessor<string>
  scheduleSheetFieldNameColumn?: Accessor<string>
  save: (team: Omit<PaintTeam, 'id'> & { googleAuth?: string }) => Promise<void>
}>()

export const TeamProvider: Component<{ children: JSX.Element }> = (props) => {
  // Right now the team comes from inside the user
  const auth = useContext(AuthenticationContext)
  const [team, setTeam] = createSignal({})

  createEffect(() => {
    console.log('SEtting team?', auth?.user?.()?.paintTeam)
    if (!auth?.user?.()?.paintTeam) return
    setTeam(auth?.user?.()?.paintTeam)
  })

  const saveTeam = async (team: PaintTeam & { googleAuth?: string }) => {
    await Promise.resolve()
    console.log('Saving team ', team)
  }

  return (
    <TeamContext.Provider value={{ team, save: saveTeam }}>
      {props.children}
    </TeamContext.Provider>
  )
}
