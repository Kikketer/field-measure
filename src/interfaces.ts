/**
 * @author Chris Weed (chris@cjweed.com) 2022
 */

export type IntergalacticResponse = {
  locations: Array<IntergalacticLocation>
}

export type IntergalacticLocation = {
  id: string
  name: string
  description: string
  photo: string
}
