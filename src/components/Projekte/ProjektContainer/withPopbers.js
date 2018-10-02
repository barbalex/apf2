// @flow
import { graphql } from 'react-apollo'

import query from './popbers'

export default graphql(query, {
  options: ({ isPop, pop }) => ({
    isPop,
    pop,
  }),
  name: 'dataPopbers',
})
