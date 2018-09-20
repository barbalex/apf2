// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './beobAssignLines.graphql'

export default graphql(query, {
  options: ({ dataLocal, treeName, nodeFilterState }) => {
    const openNodes = get(dataLocal, `${treeName}.openNodes`)
    const isProjekt = openNodes.some(
      nArray => nArray[0] === 'Projekte' && nArray[1],
    )
    const isAp =
      isProjekt &&
      openNodes.some(nArray => nArray[2] === 'Aktionspläne' && nArray[3])
    const activeNodeArray = get(dataLocal, `${treeName}.activeNodeArray`)
    const projId =
      activeNodeArray.length > 0 &&
      activeNodeArray[0] === 'Projekte' &&
      activeNodeArray.length > 1
        ? activeNodeArray[1]
        : '99999999-9999-9999-9999-999999999999'

    const projektFolder =
      (activeNodeArray.length > 0 && activeNodeArray[0] === 'Projekte') || false
    const projekt =
      projektFolder && activeNodeArray.length > 1 ? activeNodeArray[1] : null
    const apFolder =
      (projekt &&
        activeNodeArray.length > 2 &&
        decodeURIComponent(activeNodeArray[2]) === 'Aktionspläne') ||
      false
    const apId =
      apFolder && activeNodeArray.length > 3
        ? activeNodeArray[3]
        : '99999999-9999-9999-9999-999999999999'

    return {
      variables: {
        projId,
        isProjekt,
        apId,
        isAp,
      },
    }
  },
  name: 'dataBeobAssignLines',
})
