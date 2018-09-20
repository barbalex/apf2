// @flow
import { graphql } from 'react-apollo'

import query from './allAeEigenschaftens.graphql'

export default graphql(query, {
  name: 'dataAeEigenschaftens',
})
