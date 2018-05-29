//@flow
/**
   * 1. load all data
   * 2. add activeNodeArrays for all data to openNodes
   * 3. make sure every nodeArray is unique in openNodes
   * 4. update openNodes
   * 5. refresh tree
   */
import app from 'ampersand-app'
import get from 'lodash/get'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'
import groupBy from 'lodash/groupBy'

import dataGql from './data.graphql'
import setTreeKeyGql from './setTreeKey.graphql'

export default async ({
  tree,
  activeNodes,
  id,
  refetch,
}:{
  tree: Object,
  activeNodes: Object,
  id: String,
  refetch: () => void,
}) => {
  const { client } = app
  const { projekt } = activeNodes
  const { openNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id }
  })
  const zielsGrouped = groupBy(get(data, 'apById.zielsByApId.nodes'), 'jahr')

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    ...openNodes,
    ['Projekte', projekt, 'Aktionspläne', id, 'AP-Ziele'],
  ]

  Object.keys(zielsGrouped).forEach(jahr => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projekt, 'Aktionspläne', id, 'AP-Ziele', +jahr],
    ]
    const ziels = zielsGrouped[+jahr]
    ziels.forEach(ziel => {
      newOpenNodes = [
        ...newOpenNodes,
        ['Projekte', projekt, 'Aktionspläne', id, 'AP-Ziele', +jahr, ziel.id],
        ['Projekte', projekt, 'Aktionspläne', id, 'AP-Ziele', +jahr, ziel.id, 'Berichte'],
      ]
      const zielbers = get(ziel, 'zielbersByZielId.nodes')
      zielbers.forEach(zielber => {
        newOpenNodes = [
          ...newOpenNodes,
          ['Projekte', projekt, 'Aktionspläne', id, 'AP-Ziele', +jahr, ziel.id, 'Berichte', zielber.id],
        ]
      })
    })
  })

  // 3. make sure every nodeArray is unique in openNodes
  newOpenNodes = uniqWith(newOpenNodes, isEqual)
  // 4. update openNodes
  await client.mutate({
    mutation: setTreeKeyGql,
    variables: {
      tree: tree.name,
      value: newOpenNodes,
      key: 'openNodes',
    }
  })
  // 5. refresh tree
  refetch()
}