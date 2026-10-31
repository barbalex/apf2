/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */

import { apiFetch } from '../../../../../modules/api.ts'
import { store, treeAddOpenNodesAtom } from '../../../../../store/index.ts'

interface TpopFolderParams {
  popId?: string | null | undefined
  apId?: string | null | undefined
  projId?: string | null | undefined
}

export const tpopFolder = async ({
  popId,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
}: TpopFolderParams) => {
  console.log('tpopFolder', { popId, apId, projId })
  // 1. load all data
  const tpops =
    (await apiFetch<{ id: string; pop_id: string }[]>(
      `/q_tpop?pop_id=eq.${popId}&select=id,pop_id`,
    )) ?? []
  const tpopIds = tpops.map((t) => t.id)
  const tpopFilter =
    tpopIds.length ? `tpop_id=in.(${tpopIds.join(',')})` : 'id=eq.null'
  const results = await Promise.all([
    apiFetch<{ id: string; tpop_id: string }[]>(
      `/q_tpopmassn?${tpopFilter}&select=id,tpop_id`,
    ),
    apiFetch<{ id: string; tpop_id: string }[]>(
      `/q_tpopmassnber?${tpopFilter}&select=id,tpop_id`,
    ),
    apiFetch<{ id: string; tpop_id: string; typ: string }[]>(
      `/q_tpopkontr?${tpopFilter}&select=id,tpop_id,typ`,
    ),
    apiFetch<{ id: string; tpop_id: string }[]>(
      `/q_tpopber?${tpopFilter}&select=id,tpop_id`,
    ),
    apiFetch<{ id: string; tpop_id: string }[]>(
      `/q_beob?${tpopFilter}&select=id,tpop_id`,
    ),
  ])
  const tpopmassnsAll = results[0] ?? []
  const tpopmassnbersAll = results[1] ?? []
  const kontrsAll = results[2] ?? []
  const tpopbersAll = results[3] ?? []
  const beobsAll = results[4] ?? []
  const feldkontrsAll = kontrsAll.filter(
    (k) => k.typ !== 'Freiwilligen-Kontrolle',
  )
  const freiwkontrsAll = kontrsAll.filter(
    (k) => k.typ === 'Freiwilligen-Kontrolle',
  )
  const kontrIds = kontrsAll.map((k) => k.id)
  const zaehlsAll =
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
    ],
  ]
  tpops.forEach((tpop) => {
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
        tpop.id,
      ],
    ]

    const tpopmassns = tpopmassnsAll.filter((t) => t.tpop_id === tpop.id)
    const tpopmassnbers = tpopmassnbersAll.filter((t) => t.tpop_id === tpop.id)
    const tpopfeldkontrs = feldkontrsAll.filter((t) => t.tpop_id === tpop.id)
    const tpopfreiwkontrs = freiwkontrsAll.filter((t) => t.tpop_id === tpop.id)
    const tpopbers = tpopbersAll.filter((t) => t.tpop_id === tpop.id)
    const tpopbeobs = beobsAll.filter((t) => t.tpop_id === tpop.id)

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
        tpop.id,
      ],
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpop.id,
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
        tpop.id,
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
        tpop.id,
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
        tpop.id,
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
        tpop.id,
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
        tpop.id,
        'Beobachtungen',
      ],
    ]
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
          tpop.id,
          'Massnahmen',
          k.id,
        ],
      ]
    })
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
          tpop.id,
          'Massnahmen-Berichte',
          k.id,
        ],
      ]
    })
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
          tpop.id,
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
          tpop.id,
          'Feld-Kontrollen',
          k.id,
          'Zaehlungen',
        ],
      ]
      const zaehls = zaehlsAll.filter((z) => z.tpopkontr_id === k.id)
      zaehls.forEach((z) => {
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
            tpop.id,
            'Feld-Kontrollen',
            k.id,
            'Zaehlungen',
            z.id,
          ],
        ]
      })
    })
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
          tpop.id,
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
          tpop.id,
          'Freiwilligen-Kontrollen',
          k.id,
          'Zaehlungen',
        ],
      ]
      const zaehls = zaehlsAll.filter((z) => z.tpopkontr_id === k.id)
      zaehls.forEach((z) => {
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
            tpop.id,
            'Freiwilligen-Kontrollen',
            k.id,
            'Zaehlungen',
            z.id,
          ],
        ]
      })
    })
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
          tpop.id,
          'Kontroll-Berichte',
          k.id,
        ],
      ]
    })
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
          tpop.id,
          'Beobachtungen',
          k.id,
        ],
      ]
    })
  })

  // 3. update
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
