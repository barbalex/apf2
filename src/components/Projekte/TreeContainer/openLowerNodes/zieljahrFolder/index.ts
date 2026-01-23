/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import { query } from './query.ts'
import {
  store as jotaiStore,
  apolloClientAtom,
  treeAddOpenNodesAtom,
} from '../../../../../store/index.ts'

export const zieljahrFolder = async ({
  parentId: apId,
  projId = '99999999-9999-9999-9999-999999999999',
  jahr: jahrString,
}) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const jahr = +jahrString

  // 1. load all data
  const { data } = await apolloClient.query({
    query: query,
    variables: { id: apId, jahr },
  })
  const ziels = data?.apById?.zielsByApId?.nodes ?? []

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr]]

  ziels.forEach((ziel) => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr, ziel.id],
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'AP-Ziele',
        jahr,
        ziel.id,
        'Berichte',
      ],
    ]
  })

  // 3. update
  jotaiStore.set(treeAddOpenNodesAtom, newOpenNodes)
}
