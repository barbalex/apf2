// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtZuzuordnenForMapMarkers'

export default graphql(query, {
  options: ({ projId, apId, beobNichtZuzuordnenIsActiveInMap }) => ({
    projId,
    apId,
    beobNichtZuzuordnenIsActiveInMap,
  }),
  name: 'dataBeobNichtZuzuordnenForMapMarkers',
})
