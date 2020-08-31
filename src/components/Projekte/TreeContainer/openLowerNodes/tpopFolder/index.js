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
  const { addOpenNodes, projIdInActiveNodeArray, apIdInActiveNodeArray } = tree
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const tpops = get(data, 'popById.tpopsByPopId.nodes', [])
  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      id,
      'Teil-Populationen',
    ],
  ]
  tpops.forEach((tpop) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
        'Teil-Populationen',
        tpop.id,
      ],
    ]

    const tpopmassns = get(tpop, 'tpopmassnsByTpopId.nodes', [])
    const tpopmassnbers = get(tpop, 'tpopmassnbersByTpopId.nodes', [])
    const tpopfeldkontrs = get(tpop, 'tpopfeldkontrs.nodes', [])
    const tpopfreiwkontrs = get(tpop, 'tpopfreiwkontrs.nodes', [])
    const tpopbers = get(tpop, 'tpopbersByTpopId.nodes', [])
    const tpopbeobs = get(tpop, 'beobsByTpopId.nodes', [])

    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
        'Teil-Populationen',
        tpop.id,
      ],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
        'Teil-Populationen',
        tpop.id,
        'Massnahmen',
      ],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
        'Teil-Populationen',
        tpop.id,
        'Massnahmen-Berichte',
      ],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
        'Teil-Populationen',
        tpop.id,
        'Feld-Kontrollen',
      ],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
        'Teil-Populationen',
        tpop.id,
        'Freiwilligen-Kontrollen',
      ],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
        'Teil-Populationen',
        tpop.id,
        'Kontroll-Berichte',
      ],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        id,
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
          'Aktionspläne',
          apId,
          'Populationen',
          id,
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
          'Aktionspläne',
          apId,
          'Populationen',
          id,
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
          'Aktionspläne',
          apId,
          'Populationen',
          id,
          'Teil-Populationen',
          tpop.id,
          'Feld-Kontrollen',
          k.id,
        ],
        [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          id,
          'Teil-Populationen',
          tpop.id,
          'Feld-Kontrollen',
          k.id,
          'Zaehlungen',
        ],
      ]
      const zaehls = get(k, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
      zaehls.forEach((z) => {
        newOpenNodes = [
          ...newOpenNodes,
          [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            id,
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
          'Aktionspläne',
          apId,
          'Populationen',
          id,
          'Teil-Populationen',
          tpop.id,
          'Freiwilligen-Kontrollen',
          k.id,
        ],
        [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          id,
          'Teil-Populationen',
          tpop.id,
          'Freiwilligen-Kontrollen',
          k.id,
          'Zaehlungen',
        ],
      ]
      const zaehls = get(k, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
      zaehls.forEach((z) => {
        newOpenNodes = [
          ...newOpenNodes,
          [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            id,
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
          'Aktionspläne',
          apId,
          'Populationen',
          id,
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
          'Aktionspläne',
          apId,
          'Populationen',
          id,
          'Teil-Populationen',
          tpop.id,
          'Beobachtungen',
          k.id,
        ],
      ]
    })
  })

  // 3. update
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.tree()
}
