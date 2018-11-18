// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ activeNodes }) => ({
    variables: {
      isAp: !!activeNodes.ap,
      ap: activeNodes.ap ? [activeNodes.ap] : [],
    },
  }),
  name: 'data',
})
