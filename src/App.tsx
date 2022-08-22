import React, { useState } from 'react'
import Loader from './components/Loader'
import { useQuery } from '@apollo/client'
import { GET_LOCATION, GET_LOCATIONS } from './queries'
import { IntergalacticLocation, IntergalacticResponse } from './interfaces'

const App = () => {
  const query = useQuery(GET_LOCATIONS, { variables: { sure: false } })
  const [selectedLocation, setLocation] = useState<string>()
  const location = useQuery(GET_LOCATION, { skip: !selectedLocation, variables: { locationId: selectedLocation } })

  return (
    <div>
      <header>
        <h1>Field Measure</h1>
        {/*<Loader query={location}>{(data: any) => <p>{data.location.name}</p>}</Loader>*/}
        <Loader query={query}>
          {(data: IntergalacticResponse) => (
            <div>
              <select onChange={(e) => setLocation(e.target.value)} value={selectedLocation}>
                {!selectedLocation && <option>Select One</option>}
                {data.locations.map((location: IntergalacticLocation) => (
                  <option value={location.id} key={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Loader>
        <Loader query={location}>{(data: any) => <p>Got location {data.location.description}</p>}</Loader>
      </header>
    </div>
  )
}

export default App
