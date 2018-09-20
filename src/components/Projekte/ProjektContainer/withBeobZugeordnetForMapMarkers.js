// @flow
import { graphql } from 'react-apollo'

import query from './beobZugeordnetForMapMarkers.graphql'

export default graphql(query, {
  options: ({ projId, apId, apIsActiveInMap }) => ({
    projId,
    apId,
    apIsActiveInMap,
  }),
  name: 'dataBeobZugeordnetForMapMarkers',
})
