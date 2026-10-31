/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */

import { apiFetch } from '../../../../../modules/api.ts'
import { store, treeAddOpenNodesAtom } from '../../../../../store/index.ts'

interface TpopParams {
  id?: string | null | undefined
  popId?: string | null | undefined
  apId?: string | null | undefined
  projId?: string | null | undefined
}

export const tpop = async ({
  id,
  popId = '99999999-9999-9999-9999-999999999999',
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
}: TpopParams) => {
  // 1. load all data
  const results = await Promise.all([
    apiFetch<{ id: string }[]>(`/q_tpopmassn?tpop_id=eq.${id}&select=id`),
    apiFetch<{ id: string }[]>(`/q_tpopmassnber?tpop_id=eq.${id}&select=id`),
    apiFetch<{ id: string }[]>(
      `/q_tpopkontr?tpop_id=eq.${id}&typ=neq.Freiwilligen-Kontrolle&select=id`,
    ),
    apiFetch<{ id: string }[]>(
      `/q_tpopkontr?tpop_id=eq.${id}&typ=eq.Freiwilligen-Kontrolle&select=id`,
    ),
    apiFetch<{ id: string }[]>(`/q_tpopber?tpop_id=eq.${id}&select=id`),
    apiFetch<{ id: string }[]>(`/q_beob?tpop_id=eq.${id}&select=id`),
  ])
  const tpopmassns = results[0] ?? []
  const tpopmassnbers = results[1] ?? []
  const tpopfeldkontrs = results[2] ?? []
  const tpopfreiwkontrs = results[3] ?? []
  const tpopbers = results[4] ?? []
  const tpopbeobs = results[5] ?? []
  // 2. add activeNodeArrays for all data to openNodes
  // 2.0 add all folders
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
      'Massnahmen',
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
      'Massnahmen-Berichte',
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
      'Freiwilligen-Kontrollen',
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
      'Kontroll-Berichte',
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
      'Beobachtungen',
    ],
  ]
  // 2.1: tpopmassns
  tpopmassns.forEach((k) => {
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
        'Massnahmen',
        k.id,
      ],
    ]
  })

  // 2.2: tpopmassnbers
  tpopmassnbers.forEach((k) => {
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
        'Massnahmen-Berichte',
        k.id,
      ],
    ]
  })

  // 2.3: tpopfeldkontrs
  tpopfeldkontrs.forEach((k) => {
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
    /*
    const zaehls = (k?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
    zaehls.forEach(z => {
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
    })*/
  })

  // 2.4: tpopfreiwkontrs
  tpopfreiwkontrs.forEach((k) => {
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
        'Freiwilligen-Kontrollen',
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
        'Freiwilligen-Kontrollen',
        k.id,
        'Zaehlungen',
      ],
    ]
    /*
    const zaehls = (k?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
    zaehls.forEach(z => {
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
          'Freiwilligen-Kontrollen',
          k.id,
          'Zaehlungen',
          z.id,
        ],
      ]
    })*/
  })

  // 2.5: tpopbers
  tpopbers.forEach((k) => {
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
        'Kontroll-Berichte',
        k.id,
      ],
    ]
  })

  // 2.6: tpopbeobs
  tpopbeobs.forEach((k) => {
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
        'Beobachtungen',
        k.id,
      ],
    ]
  })

  // 3. update openNodes
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
