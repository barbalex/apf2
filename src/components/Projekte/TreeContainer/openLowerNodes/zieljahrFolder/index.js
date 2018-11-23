//@flow
/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import get from 'lodash/get'

import dataGql from './data'

export default async ({
  tree,
  activeNodes,
  id: jahrString,
  parentId: apId,
  refetchTree,
  client,
  mobxStore,
}: {
  tree: Object,
  activeNodes: Object,
  id: String,
  parentId: String,
  refetchTree: () => void,
  client: Object,
  mobxStore: Object,
}) => {
  const { setTreeKey } = mobxStore
  const jahr = +jahrString
  const { projekt } = activeNodes
  const { openNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id: apId, jahr },
  })
  const ziels = get(data, 'apById.zielsByApId.nodes', [])

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    ...openNodes,
    ['Projekte', projekt, 'Aktionspläne', apId, 'AP-Ziele', jahr],
  ]

  ziels.forEach(ziel => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projekt, 'Aktionspläne', apId, 'AP-Ziele', jahr, ziel.id],
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        apId,
        'AP-Ziele',
        jahr,
        ziel.id,
        'Berichte',
      ],
    ]
    const zielbers = get(ziel, 'zielbersByZielId.nodes', [])
    zielbers.forEach(zielber => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          apId,
          'AP-Ziele',
          jahr,
          ziel.id,
          'Berichte',
          zielber.id,
        ],
      ]
    })
  })

  // 3. update openNodes
  setTreeKey({
    tree: tree.name,
    value: newOpenNodes,
    key: 'openNodes',
  })

  // 4. refresh tree
  refetchTree('ziels')
}
