// @flow
import { graphql } from 'react-apollo'

import query from './projekts.graphql'

export default graphql(query, {
  name: 'dataProjekts',
})
