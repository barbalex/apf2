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

export const tpopFolder = async ({
  popId,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
}) => {
  console.log('tpopFolder', { popId, apId, projId })
  const apolloClient = store.get(apolloClientAtom)
  // 1. load all data
  const { data } = await apolloClient.query({
    query: query,
    variables: { id: popId },
  })
  const tpops = data?.popById?.tpopsByPopId?.nodes ?? []
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

    const tpopmassns = tpop?.tpopmassnsByTpopId?.nodes ?? []
    const tpopmassnbers = tpop?.tpopmassnbersByTpopId?.nodes ?? []
    const tpopfeldkontrs = tpop?.tpopfeldkontrs?.nodes ?? []
    const tpopfreiwkontrs = tpop?.tpopfreiwkontrs?.nodes ?? []
    const tpopbers = tpop?.tpopbersByTpopId?.nodes ?? []
    const tpopbeobs = tpop?.beobsByTpopId?.nodes ?? []

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
      const zaehls = k?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
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
      const zaehls = k?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
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
  store.set(treeAddOpenNodesAtom, newOpenNodes)
}
