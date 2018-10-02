// @flow
import { graphql } from 'react-apollo'

import query from './zielbers'

export default graphql(query, {
  options: ({ isZiel, ziel }) => ({
    isZiel,
    ziel,
  }),
  name: 'dataZielbers',
})
