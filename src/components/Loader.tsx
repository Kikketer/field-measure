/**
 * @author Chris Weed (chris@cjweed.com) 2022
 */

import { ApolloQueryResult } from '@apollo/client'

interface LoaderParams {
  query: ApolloQueryResult<any>
  children: (T: any) => JSX.Element
}

const Loader = ({ query, children }: LoaderParams) => {
  if (query.error) return <p>{query.error.message}</p>
  if (query.loading) return <p aria-label={'Loading'}>🎡</p>

  if (!query.data) return null

  return children(query.data)
}

Loader.displayName = 'Loader'

export default Loader
