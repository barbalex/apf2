// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './data'

export default graphql(query, {
  options: ({ localData, treeName }) => ({
    variables: {
      id: get(
        localData,
        `${treeName}.activeNodeArray[3]`,
        // pass in fake id to avoid error when filter is shown
        // which means there is no id
        '99999999-9999-9999-9999-999999999999',
      ),
    },
  }),
  name: 'data',
})
