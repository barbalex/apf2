/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */

import { apiFetch } from '../../../../../modules/api.ts'
import { store, treeAddOpenNodesAtom } from '../../../../../store/index.ts'

interface PopParams {
  id?: string | null | undefined
  apId?: string | null | undefined
  projId?: string | null | undefined
}

export const pop = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
}: PopParams) => {
  // 1. load all data
  const results = await Promise.all([
    apiFetch<{ id: string }[]>(`/q_tpop?pop_id=eq.${id}&select=id`),
    apiFetch<{ id: string }[]>(`/q_popber?pop_id=eq.${id}&select=id`),
    apiFetch<{ id: string }[]>(`/q_popmassnber?pop_id=eq.${id}&select=id`),
  ])
  const tpops = results[0] ?? []
  const popbers = results[1] ?? []
  const popmassnbers = results[2] ?? []
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
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
