/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import get from 'lodash/get'

import dataGql from './data'

export default async ({ treeName, id, client, store }) => {
  const tree = store[treeName]
  const { refetch } = store
  const { addOpenNodes, apIdInActiveNodeArray, projIdInActiveNodeArray } = tree
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const tpops = get(data, 'popById.tpopsByPopId.nodes', [])
  const popbers = get(data, 'popById.popbersByPopId.nodes', [])
  const popmassnbers = get(data, 'popById.popmassnbersByPopId.nodes', [])
  // 2. add activeNodeArrays for all data to openNodes
  const newOpenNodes = [
    ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', id],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      id,
      'Teil-Populationen',
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      id,
      'Kontroll-Berichte',
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      id,
      'Massnahmen-Berichte',
    ],
    popbers.map((o) => [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      id,
      'Kontroll-Berichte',
      o.id,
    ]),
    popmassnbers.map((o) => [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      id,
      'Massnahmen-Berichte',
      o.id,
    ]),
    tpops.map((o) => [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      id,
      'Teil-Populationen',
      o.id,
    ]),
  ]

  // 3. update openNodes
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.tree()
}
