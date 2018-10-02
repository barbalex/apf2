// @flow
import { graphql } from 'react-apollo'

import query from './popForMapMarkers'

export default graphql(query, {
  options: ({ projId, apId, apIsActiveInMap }) => ({
    projId,
    apId,
    apIsActiveInMap,
  }),
  name: 'dataPopForMapMarkers',
})
