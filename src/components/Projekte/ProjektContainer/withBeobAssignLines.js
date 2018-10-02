// @flow
import { graphql } from 'react-apollo'

import query from './beobAssignLines'

export default graphql(query, {
  options: ({ projId, isProjekt, apId, isAp }) => ({
    projId,
    isProjekt,
    apId,
    isAp,
  }),
  name: 'dataBeobAssignLines',
})
