/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import { groupBy } from 'es-toolkit'

import { query } from './query.ts'
import {
  store as jotaiStore,
  apolloClientAtom,
  treeAddOpenNodesAtom,
} from '../../../../../store/index.ts'

export const zielFolder = async ({
  id,
  projId = '99999999-9999-9999-9999-999999999999',
}) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)

  // 1. load all data
  const { data } = await apolloClient.query({
    query: query,
    variables: { id },
  })
  const zielsGrouped = groupBy(
    data?.apById?.zielsByApId?.nodes ?? [],
    (e) => e.jahr,
  )

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
    })
  })

  // 3. update openNodes
  jotaiStore.set(treeAddOpenNodesAtom, newOpenNodes)
}
