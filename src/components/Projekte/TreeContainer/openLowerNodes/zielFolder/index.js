//@flow
/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'

import dataGql from './data'

export default async ({
  treeName,
  id,
  client,
  mobxStore,
}: {
  treeName: Object,
  id: String,
  client: Object,
  mobxStore: Object,
}) => {
  const tree = mobxStore[treeName]
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { refetch } = mobxStore
  const { projekt } = activeNodes
  const { addOpenNodes } = tree
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
  let newOpenNodes = [['Projekte', projekt, 'Aktionspläne', id, 'AP-Ziele']]

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
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.ziels()
}
