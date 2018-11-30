// @flow
import { graphql } from 'react-apollo'

import query from './tpopForMap'

export default graphql(query, {
  options: ({ projId, apId, tpopIsActiveInMap }) => ({
    projId,
    apId,
    tpopIsActiveInMap,
  }),
  name: 'dataTpopForMap',
})
