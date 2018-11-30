// @flow
import { graphql } from 'react-apollo'

import query from './beobZugeordnetForMapMarkers'

export default graphql(query, {
  options: ({ projId, apId, beobZugeordnetIsActiveInMap }) => ({
    projId,
    apId,
    beobZugeordnetIsActiveInMap,
  }),
  name: 'dataBeobZugeordnetForMapMarkers',
})
