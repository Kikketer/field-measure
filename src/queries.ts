/**
 * @author Chris Weed (chris@cjweed.com) 2022
 */
import { gql } from '@apollo/client'

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
    }
  }
`

export const GET_LOCATION = gql`
  query GetLocationById($locationId: ID!) {
    location(id: $locationId) {
      name
      description
    }
  }
`
