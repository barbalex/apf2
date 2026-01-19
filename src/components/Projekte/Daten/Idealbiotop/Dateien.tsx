import { useParams } from 'react-router'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { query } from './query.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { Idealbiotop } from '../../../../models/apflora/index.tsx'

interface IdealbiotopQueryResult {
  allIdealbiotops?: {
    nodes: Idealbiotop[]
  }
}

export const Component = () => {
  const { apId } = useParams()
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['idealbiotop', apId],
    queryFn: async () => {
      const result = await apolloClient.query<IdealbiotopQueryResult>({
        query,
        variables: { id: apId },
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data?.allIdealbiotops?.nodes?.[0] ?? {}

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
