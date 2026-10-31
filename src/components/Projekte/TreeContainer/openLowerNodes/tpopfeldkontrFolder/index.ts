/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */

import { apiFetch } from '../../../../../modules/api.ts'
import { store, treeAddOpenNodesAtom } from '../../../../../store/index.ts'

interface TpopfeldkontrFolderParams {
  id?: string | null | undefined
  apId?: string | null | undefined
  projId?: string | null | undefined
  popId?: string | null | undefined
}

export const tpopfeldkontrFolder = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
  popId = '99999999-9999-9999-9999-999999999999',
}: TpopfeldkontrFolderParams) => {
  // 1. load all data
  const kontrs =
    (await apiFetch<{ id: string }[]>(
      `/q_tpopkontr?tpop_id=eq.${id}&typ=neq.Freiwilligen-Kontrolle&select=id`,
    )) ?? []
  const kontrIds = kontrs.map((k) => k.id)
  const zaehls =
    kontrIds.length ?
      ((await apiFetch<{ id: string; tpopkontr_id: string }[]>(
        `/q_tpopkontrzaehl?tpopkontr_id=in.(${kontrIds.join(',')})&select=id,tpopkontr_id`,
      )) ?? [])
    : []
  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Feld-Kontrollen',
    ],
  ]
  kontrs.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
      ],
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
        'Zaehlungen',
      ],
    ]
    const zaehlsOfKontr = zaehls.filter((z) => z.tpopkontr_id === k.id)
    zaehlsOfKontr.forEach((z) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          id,
          'Feld-Kontrollen',
          k.id,
          'Zaehlungen',
          z.id,
        ],
      ]
    })
  })

  // 3. update openNodes
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
