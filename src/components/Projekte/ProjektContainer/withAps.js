// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './aps.graphql'

export default graphql(query, {
  options: ({ dataLocal, treeName }) => {
    const openNodes = get(dataLocal, `${treeName}.openNodes`)
    const isProjekt = openNodes.some(
      nArray => nArray[0] === 'Projekte' && nArray[1],
    )
    const activeNodeArray = get(dataLocal, `${treeName}.activeNodeArray`)
    const projId =
      activeNodeArray.length > 0 &&
      activeNodeArray[0] === 'Projekte' &&
      activeNodeArray.length > 1
        ? activeNodeArray[1]
        : '99999999-9999-9999-9999-999999999999'
    const apFilter = { projId: { in: projId } }

    return {
      variables: {
        isProjekt,
        apFilter,
      },
    }
  },
  name: 'dataAps',
})
