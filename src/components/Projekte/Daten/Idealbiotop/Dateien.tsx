import { useParams } from 'react-router'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { query } from './query.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { IdealbiotopId } from '../../../../models/apflora/index.ts'

interface IdealbiotopNode {
  id: IdealbiotopId
}

interface IdealbiotopQueryResult {
  allIdealbiotops?: {
    nodes: IdealbiotopNode[]
  }
}

export const Component = () => {
  const { apId } = useParams()
  const apolloClient = useApolloClient()

  const { data } = useSuspenseQuery({
    queryKey: ['idealbiotop', apId],
    queryFn: async () => {
      const result = await apolloClient.query<IdealbiotopQueryResult>({
        query,
        variables: { id: apId },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const row: Partial<IdealbiotopNode> = data?.allIdealbiotops?.nodes?.[0] ?? {}

  return (
    <>
      <FormTitle title="Dateien" />
      <FilesRouter
        parentId={row.id}
        parent="idealbiotop"
      />
    </>
  )
}
