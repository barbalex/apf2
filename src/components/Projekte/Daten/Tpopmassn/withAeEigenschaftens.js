// @flow
import { graphql } from 'react-apollo'

import query from './allAeEigenschaftens'

export default graphql(query, {
  name: 'dataAeEigenschaftens',
})
