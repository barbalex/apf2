// @flow
import { graphql } from 'react-apollo'

import query from './allAeEigenschaftensQuery'

export default graphql(query, {
  name: 'dataAeEigenschaftens',
})
