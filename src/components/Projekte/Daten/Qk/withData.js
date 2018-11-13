// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './data'

export default graphql(query, {
  options: ({ treeName, berichtjahr, apId, localData }) => ({
    variables: {
      berichtjahr,
      isBerichtjahr: !!berichtjahr,
      apId,
      projId: get(localData, `${treeName}.activeNodeArray[1]`),
    },
  }),
  name: 'data',
})
