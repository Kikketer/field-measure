import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSupabase } from './SupabaseProvider'

const UserContext = createContext(null)

const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState()
  const { supabase } = useSupabase()

  useEffect(() => {
    supabase
      .from('users')
      .select(
        `
      *,
      paintTeam: paint_team_id (
        *
      )
    `,
      )
      .then((user) => setUser(user))
  })

  return (
    <UserContext.Provider value={{ value, setValue }}>
      {children}
    </UserContext.Provider>
  )
}

const useMyContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
