//@flow
/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import app from 'ampersand-app'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'

import dataGql from './data'
import setTreeKeyGql from './setTreeKey'

export default async ({
  tree,
  activeNodes,
  id,
  refetchTree,
}: {
  tree: Object,
  activeNodes: Object,
  id: String,
  refetchTree: () => void,
}) => {
  const { client } = app
  const { projekt } = activeNodes
  const { openNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const zielsGrouped = groupBy(
    get(data, 'apById.zielsByApId.nodes', []),
    'jahr',
  )

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
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'AP-Ziele',
          +jahr,
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
            id,
            'AP-Ziele',
            +jahr,
            ziel.id,
            'Berichte',
            zielber.id,
          ],
        ]
      })
    })
  })

  // 3. update openNodes
  await client.mutate({
    mutation: setTreeKeyGql,
    variables: {
      tree: tree.name,
      value: newOpenNodes,
      key: 'openNodes',
    },
  })

  // 4. refresh tree
  refetchTree('ziels')
}
