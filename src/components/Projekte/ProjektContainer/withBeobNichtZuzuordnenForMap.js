// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtZuzuordnenForMap'

export default graphql(query, {
  options: ({ projId, apId, beobNichtZuzuordnenIsActiveInMap }) => ({
    projId,
    apId,
    beobNichtZuzuordnenIsActiveInMap,
  }),
  name: 'dataBeobNichtZuzuordnenForMap',
})
