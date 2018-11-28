// @flow
import { graphql } from 'react-apollo'

import query from './aps'

export default graphql(query, {
  options: ({ isProjekt, apFilterSet }) => ({
    isProjekt,
    apFilter: apFilterSet,
  }),
  name: 'dataAps',
})
