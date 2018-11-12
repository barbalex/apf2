// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './data'

export default graphql(query, {
  options: ({ localData, treeName }) => ({
    variables: {
      id: get(localData, `${treeName}.activeNodeArray[2]`),
    },
  }),
  name: 'data',
})
