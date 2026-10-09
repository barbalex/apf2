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

import type { ZielFieldsFragment } from '../../../../../gql/graphql.ts'

interface ZieljahrFolderQueryResult {
  apById?: {
    zielsByApId?: {
      nodes: ZielFieldsFragment[]
    }
  }
}

interface ZieljahrFolderParams {
  parentId?: string | null | undefined
  projId?: string | null | undefined
  jahr?: string | null | undefined
  // id is passed but not used
  id?: string | null | undefined
}

export const zieljahrFolder = async ({
  parentId: apId,
  projId = '99999999-9999-9999-9999-999999999999',
  jahr: jahrString,
}: ZieljahrFolderParams) => {
  // apolloClient is set during app startup
  const apolloClient = store.get(apolloClientAtom) as ApolloClient
  const jahr = +(jahrString as string)

  // 1. load all data
  const { data } = await apolloClient.query<ZieljahrFolderQueryResult>({
    query: query,
    variables: { id: apId, jahr },
  })
  const ziels = data?.apById?.zielsByApId?.nodes ?? []

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr]]

  ziels.forEach((ziel) => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr, ziel.id],
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'AP-Ziele',
        jahr,
        ziel.id,
        'Berichte',
      ],
    ]
  })

  // 3. update
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
