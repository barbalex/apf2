// @flow
import { graphql } from 'react-apollo'

import query from './popmassnbers.graphql'

export default graphql(query, {
  options: ({ isPop, pop }) => ({
    isPop,
    pop,
  }),
  name: 'dataPopmassnbers',
})
