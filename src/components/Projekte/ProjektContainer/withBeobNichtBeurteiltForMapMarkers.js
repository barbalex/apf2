// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtBeurteiltForMapMarkers'

export default graphql(query, {
  options: ({ projId, apId, beobNichtBeurteiltIsActiveInMap }) => ({
    projId,
    apId,
    beobNichtBeurteiltIsActiveInMap,
  }),
  name: 'dataBeobNichtBeurteiltForMapMarkers',
})
