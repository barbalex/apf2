// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'
import uniq from 'lodash/uniq'

import query from './beobNichtBeurteilts.graphql'

export default graphql(query, {
  options: ({ dataLocal, treeName, nodeFilterState }) => {
    const openNodes = get(dataLocal, `${treeName}.openNodes`)
    const isProjekt = openNodes.some(
      nArray => nArray[0] === 'Projekte' && nArray[1],
    )
    const isAp =
      isProjekt &&
      openNodes.some(nArray => nArray[2] === 'Aktionspläne' && nArray[3])
    const ap = uniq(
      openNodes
        .map(
          a =>
            a.length > 3 &&
            a[0] === 'Projekte' &&
            decodeURIComponent(a[2]) === 'Aktionspläne'
              ? a[3]
              : null,
        )
        .filter(v => v !== null),
    )

    return {
      variables: {
        isAp,
        ap,
      },
    }
  },
  name: 'dataBeobNichtBeurteilts',
})
