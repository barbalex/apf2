// @flow
import { graphql } from 'react-apollo'

import query from './aps.graphql'

export default graphql(query, {
  options: ({ isProjekt, apFilter }) => ({
    isProjekt,
    apFilter,
  }),
  name: 'dataAps',
})
