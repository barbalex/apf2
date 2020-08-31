/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import get from 'lodash/get'

import dataGql from './data'

export default async ({
  treeName,
  id: jahrString,
  parentId: apId,
  client,
  store,
}) => {
  const tree = store[treeName]
  const { refetch } = store
  const jahr = +jahrString
  const { addOpenNodes, projIdInActiveNodeArray } = tree
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id: apId, jahr },
  })
  const ziels = get(data, 'apById.zielsByApId.nodes', [])

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', jahr],
  ]

  ziels.forEach((ziel) => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', jahr, ziel.id],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Ziele',
        jahr,
        ziel.id,
        'Berichte',
      ],
    ]
    const zielbers = get(ziel, 'zielbersByZielId.nodes', [])
    zielbers.forEach((zielber) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
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

  // 3. update
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.tree()
}
