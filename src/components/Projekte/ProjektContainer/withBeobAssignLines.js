// @flow
import { graphql } from 'react-apollo'

import query from './beobAssignLines'

export default graphql(query, {
  options: ({
    projId,
    beobZugeordnetAssignPolylinesIsActiveInMap,
    apId,
    isAp,
  }) => ({
    projId,
    beobZugeordnetAssignPolylinesIsActiveInMap,
    apId,
    isAp,
  }),
  name: 'dataBeobAssignLines',
})
