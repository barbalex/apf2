// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ treeName, berichtjahr, mobxStore }) => {
    const { activeNodeArray } = mobxStore[treeName]
    const apId =
      activeNodeArray.length > 3
        ? activeNodeArray[3]
        : '99999999-9999-9999-9999-999999999999'
    const projId =
      activeNodeArray.length > 1
        ? activeNodeArray[1]
        : '99999999-9999-9999-9999-999999999999'
    const isBerichtjahr = !!berichtjahr

    return {
      variables: {
        berichtjahr,
        isBerichtjahr,
        apId,
        projId,
      },
    }
  },
  name: 'data',
})
