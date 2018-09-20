// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'
import uniq from 'lodash/uniq'

import query from './apberuebersichts.graphql'

export default graphql(query, {
  options: ({ dataLocal, treeName }) => {
    const openNodes = get(dataLocal, `${treeName}.openNodes`)
    const isProjekt = openNodes.some(
      nArray => nArray[0] === 'Projekte' && nArray[1],
    )
    const projekt = uniq(
      openNodes
        .map(a => (a.length > 1 && a[0] === 'Projekte' ? a[1] : null))
        .filter(v => v !== null),
    )

    return {
      variables: {
        isProjekt,
        projekt,
      },
    }
  },
  name: 'dataApberuebersichts',
})
