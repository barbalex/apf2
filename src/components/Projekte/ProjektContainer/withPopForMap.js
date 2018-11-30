// @flow
import { graphql } from 'react-apollo'

import query from './popForMap'

export default graphql(query, {
  options: ({ popIsActiveInMap, apId, projId }) => ({
    apId,
    projId,
    popIsActiveInMap,
  }),
  name: 'dataPopForMap',
})
