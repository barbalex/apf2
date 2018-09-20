// @flow
import { graphql } from 'react-apollo'

import query from './popForMapMarkers.graphql'

export default graphql(query, {
  options: ({ projId, apId, apIsActiveInMap }) => ({
    projId,
    apId,
    apIsActiveInMap,
  }),
  name: 'dataPopForMapMarkers',
})
