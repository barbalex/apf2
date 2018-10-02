// @flow
import { graphql } from 'react-apollo'

import query from './projekts'

export default graphql(query, {
  name: 'dataProjekts',
})
