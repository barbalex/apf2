// @flow
import { graphql } from 'react-apollo'

import query from './apberuebersichts'

export default graphql(query, {
  options: ({ isProjekt, projekt }) => ({
    isProjekt,
    projekt,
  }),
  name: 'dataApberuebersichts',
})
