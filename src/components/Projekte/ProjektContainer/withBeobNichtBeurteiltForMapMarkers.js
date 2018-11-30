// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtBeurteiltForMap'

export default graphql(query, {
  options: ({ projId, apId, beobNichtBeurteiltIsActiveInMap }) => ({
    projId,
    apId,
    beobNichtBeurteiltIsActiveInMap,
  }),
  name: 'dataBeobNichtBeurteiltForMapMarkers',
})
