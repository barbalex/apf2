/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import groupBy from 'lodash/groupBy'

import dataGql from './data'

const openLowerNodesZielFolder = async ({ treeName, id, client, store }) => {
  const tree = store[treeName]
  const { addOpenNodes, projIdInActiveNodeArray } = tree
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const zielsGrouped = groupBy(data?.apById?.zielsByApId?.nodes ?? [], 'jahr')

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [['Projekte', projId, 'Arten', id, 'AP-Ziele']]

  Object.keys(zielsGrouped).forEach((jahr) => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', id, 'AP-Ziele', +jahr],
    ]
    const ziels = zielsGrouped[+jahr]
    ziels.forEach((ziel) => {
      newOpenNodes = [
        ...newOpenNodes,
        ['Projekte', projId, 'Arten', id, 'AP-Ziele', +jahr, ziel.id],
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'AP-Ziele',
          +jahr,
          ziel.id,
          'Berichte',
        ],
      ]
      const zielbers = ziel?.zielbersByZielId?.nodes ?? []
      zielbers.forEach((zielber) => {
        newOpenNodes = [
          ...newOpenNodes,
          [
            'Projekte',
            projId,
            'Arten',
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
  client.refetchQueries({
    include: ['TreeAllQuery'],
  })
}

export default openLowerNodesZielFolder
