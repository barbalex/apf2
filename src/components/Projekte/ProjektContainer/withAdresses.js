// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './adresses.graphql'

export default graphql(query, {
  options: ({ treeName, dataLocal, nodeFilterState }) => {
    const openNodes = get(dataLocal, `${treeName}.openNodes`)
    const isWerteListen = openNodes.some(
      nodeArray => nodeArray[0] === 'Werte-Listen',
    )
    const isAdresse = openNodes.some(
      nodeArray =>
        nodeArray[0] === 'Werte-Listen' && nodeArray[1] === 'Adressen',
    )
    return {
      variables: {
        isWerteListen,
        isAdresse,
      },
    }
  },
  name: 'dataAdresses',
})
