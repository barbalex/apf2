//@flow
/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import get from 'lodash/get'

import dataGql from './data'

export default async ({
  treeName,
  id,
  client,
  mobxStore,
}: {
  treeName: string,
  id: String,
  client: Object,
  mobxStore: Object,
}) => {
  const tree = mobxStore[treeName]
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { refetch } = mobxStore
  const { projekt, ap, pop } = activeNodes
  const { addOpenNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const tpopmassns = get(data, 'tpopById.tpopmassnsByTpopId.nodes', [])
  const tpopmassnbers = get(data, 'tpopById.tpopmassnbersByTpopId.nodes', [])
  const tpopfeldkontrs = get(data, 'tpopById.tpopfeldkontrs.nodes', [])
  const tpopfreiwkontrs = get(data, 'tpopById.tpopfreiwkontrs.nodes', [])
  const tpopbers = get(data, 'tpopById.tpopbersByTpopId.nodes', [])
  const tpopbeobs = get(data, 'tpopById.beobsByTpopId.nodes', [])
  // 2. add activeNodeArrays for all data to openNodes
  // 2.0 add all folders
  let newOpenNodes = [
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
    ],
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
      'Massnahmen',
    ],
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
      'Massnahmen-Berichte',
    ],
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
      'Feld-Kontrollen',
    ],
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
      'Freiwilligen-Kontrollen',
    ],
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
      'Kontroll-Berichte',
    ],
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
      'Beobachtungen',
    ],
  ]
  // 2.1: tpopmassns
  tpopmassns.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Massnahmen',
        k.id,
      ],
    ]
  })

  // 2.2: tpopmassnbers
  tpopmassnbers.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Massnahmen-Berichte',
        k.id,
      ],
    ]
  })

  // 2.3: tpopfeldkontrs
  tpopfeldkontrs.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
      ],
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
        'Zaehlungen',
      ],
    ]
    /*
    const zaehls = get(k, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
    zaehls.forEach(z => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          ap,
          'Populationen',
          pop,
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
  tpopfreiwkontrs.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Freiwilligen-Kontrollen',
        k.id,
      ],
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Freiwilligen-Kontrollen',
        k.id,
        'Zaehlungen',
      ],
    ]
    /*
    const zaehls = get(k, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
    zaehls.forEach(z => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          ap,
          'Populationen',
          pop,
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
  tpopbers.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Kontroll-Berichte',
        k.id,
      ],
    ]
  })

  // 2.6: tpopbeobs
  tpopbeobs.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Beobachtungen',
        k.id,
      ],
    ]
  })

  // 3. update openNodes
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.tpops()
}
