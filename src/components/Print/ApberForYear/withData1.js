// @flow
import { graphql } from 'react-apollo'

import query from './data1'
import getActiveNodes from '../../../modules/getActiveNodes'

export default graphql(query, {
  options: ({ activeNodeArray }) => {
    const { apberuebersicht: apberuebersichtId } = getActiveNodes(
      activeNodeArray,
    )
    return {
      variables: {
        apberuebersichtId,
      },
    }
  },
  name: 'data1',
})
