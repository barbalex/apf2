// @flow
import { graphql } from 'react-apollo'

import query from './pops'

export default graphql(query, {
  options: ({ isAp, popFilter }) => ({
    isAp,
    popFilter,
  }),
  name: 'dataPops',
})
