// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './data'

export default graphql(query, {
  options: ({ localData }) => ({
    variables: {
      name: get(localData, 'user.name'),
    },
  }),
  name: 'data',
})
