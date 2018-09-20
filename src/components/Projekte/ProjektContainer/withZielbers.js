// @flow
import { graphql } from 'react-apollo'

import query from './zielbers.graphql'

export default graphql(query, {
  options: ({ isZiel, ziel }) => ({
    isZiel,
    ziel,
  }),
  name: 'dataZielbers',
})
