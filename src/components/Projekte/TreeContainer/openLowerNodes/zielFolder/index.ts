/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import { groupBy } from 'es-toolkit'
import type { ApolloClient } from '@apollo/client'

import { query } from './query.ts'
import {
  store,
  apolloClientAtom,
  treeAddOpenNodesAtom,
} from '../../../../../store/index.ts'

import type { ZielFieldsFragment } from '../../../../../gql/graphql.ts'

interface ZielFolderQueryResult {
  apById?: {
    zielsByApId?: {
      nodes: ZielFieldsFragment[]
    }
  }
}

interface ZielFolderParams {
  id?: string | null | undefined
  projId?: string | null | undefined
}

export const zielFolder = async ({
  id,
  projId = '99999999-9999-9999-9999-999999999999',
}: ZielFolderParams) => {
  // apolloClient is set during app startup
  const apolloClient = store.get(apolloClientAtom) as ApolloClient

  // 1. load all data
  const { data } = await apolloClient.query<ZielFolderQueryResult>({
    query: query,
    variables: { id },
  })
  const zielsGrouped = groupBy(
    data?.apById?.zielsByApId?.nodes ?? [],
    (e) => e.jahr,
  )

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes: (string | number | null | undefined)[][] = [
    ['Projekte', projId, 'Arten', id, 'AP-Ziele'],
  ]

  Object.keys(zielsGrouped).forEach((jahr) => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', id, 'AP-Ziele', +jahr],
    ]
    const ziels = zielsGrouped[+jahr]
    ziels?.forEach((ziel) => {
      newOpenNodes = [
        ...newOpenNodes,
        ['Projekte', projId, 'Arten', id, 'AP-Ziele', +jahr, ziel.id],
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'AP-Ziele',
          +jahr,
          ziel.id,
          'Berichte',
        ],
      ]
    })
  })

  // 3. update openNodes
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
