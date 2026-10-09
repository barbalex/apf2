/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import type { ApolloClient } from '@apollo/client'

import { query } from './query.ts'
import {
  store,
  apolloClientAtom,
  treeAddOpenNodesAtom,
} from '../../../../../store/index.ts'

interface EkOpenLowerNodesQueryResult {
  tpopById?: {
    tpopkontrsByTpopId?: {
      nodes: {
        id: string
        tpopkontrzaehlsByTpopkontrId?: { nodes: { id: string }[] }
      }[]
    }
  }
}

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
  // apolloClient is set during app startup
  const apolloClient = store.get(apolloClientAtom) as ApolloClient

  // 1. load all data
  const { data } = await apolloClient.query<EkOpenLowerNodesQueryResult>({
    query: query,
    variables: { id },
  })
  const tpopkontrs = data?.tpopById?.tpopkontrsByTpopId?.nodes ?? []
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
  tpopkontrs.forEach((k) => {
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
