// @flow
import { graphql } from 'react-apollo'

import query from './tpops'

export default graphql(query, {
  options: ({ isPop, tpopFilter }) => ({
    isPop,
    tpopFilter,
  }),
  name: 'dataTpops',
})
