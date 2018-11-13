// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './localData'

export default graphql(query, {
  options: ({ treeName }) => ({
    variables: {
      id: get(query, `${treeName}.activeNodeArray[1]`),
    },
  }),
  name: 'localData',
})
