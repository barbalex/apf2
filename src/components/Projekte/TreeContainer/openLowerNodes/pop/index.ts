/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import { query } from './query.ts'
import {
  store,
  apolloClientAtom,
  treeAddOpenNodesAtom,
} from '../../../../../store/index.ts'

export const pop = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
}) => {
  const apolloClient = store.get(apolloClientAtom)

  // 1. load all data
  const { data } = await apolloClient.query({
    query: query,
    variables: { id },
  })
  const tpops = data?.popById?.tpopsByPopId?.nodes ?? []
  const popbers = data?.popById?.popbersByPopId?.nodes ?? []
  const popmassnbers = data?.popById?.popmassnbersByPopId?.nodes ?? []
  // 2. add activeNodeArrays for all data to openNodes
  const newOpenNodes = [
    ['Projekte', projId, 'Arten', apId, 'Populationen', id],
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Teil-Populationen',
    ],
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Kontroll-Berichte',
    ],
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Massnahmen-Berichte',
    ],
    ...popbers.map((o) => [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Kontroll-Berichte',
      o.id,
    ]),
    ...popmassnbers.map((o) => [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Massnahmen-Berichte',
      o.id,
    ]),
    ...tpops.map((o) => [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Teil-Populationen',
      o.id,
    ]),
  ]

  // 3. update openNodes
  store.set(treeAddOpenNodesAtom, newOpenNodes)
}
