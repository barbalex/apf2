/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */

import { apiFetch } from '../../../../../modules/api.ts'
import { store, treeAddOpenNodesAtom } from '../../../../../store/index.ts'

interface PopFolderParams {
  id?: string | null | undefined
  projId?: string | null | undefined
}

export const popFolder = async ({
  id,
  projId = '99999999-9999-9999-9999-999999999999',
}: PopFolderParams) => {
  // 1. load all data
  const pops =
    (await apiFetch<{ id: string }[]>(`/q_pop?ap_id=eq.${id}&select=id`)) ?? []

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [['Projekte', projId, 'Arten', id, 'Populationen']]

  const popIds = pops.map((p) => p.id)
  const [tpopsAll, popbersAll, popmassnbersAll] = await Promise.all(
    popIds.length ?
      [
        apiFetch<{ id: string; pop_id: string }[]>(
          `/q_tpop?pop_id=in.(${popIds.join(',')})&select=id,pop_id`,
        ),
        apiFetch<{ id: string; pop_id: string }[]>(
          `/q_popber?pop_id=in.(${popIds.join(',')})&select=id,pop_id`,
        ),
        apiFetch<{ id: string; pop_id: string }[]>(
          `/q_popmassnber?pop_id=in.(${popIds.join(',')})&select=id,pop_id`,
        ),
      ]
    : [[], [], []],
  )
  pops.forEach((pop) => {
    const tpops = (tpopsAll ?? []).filter((t) => t.pop_id === pop.id)
    const popbers = (popbersAll ?? []).filter((t) => t.pop_id === pop.id)
    const popmassnbers = (popmassnbersAll ?? []).filter(
      (t) => t.pop_id === pop.id,
    )
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', id, 'Populationen', pop.id],
      [
        'Projekte',
        projId,
        'Arten',
        id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
      ],
      [
        'Projekte',
        projId,
        'Arten',
        id,
        'Populationen',
        pop.id,
        'Kontroll-Berichte',
      ],
      [
        'Projekte',
        projId,
        'Arten',
        id,
        'Populationen',
        pop.id,
        'Massnahmen-Berichte',
      ],
    ]
    popbers.forEach((o) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'Populationen',
          pop.id,
          'Kontroll-Berichte',
          o.id,
        ],
      ]
    })
    popmassnbers.forEach((o) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'Populationen',
          pop.id,
          'Massnahmen-Berichte',
          o.id,
        ],
      ]
    })
    tpops.forEach((tpop) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
        ],
      ]
    })
  })

  // 3. update openNodes
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
