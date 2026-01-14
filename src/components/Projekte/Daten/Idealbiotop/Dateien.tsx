import { useParams } from 'react-router'
import { useQuery } from '@apollo/client/react'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { query } from './query.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { Idealbiotop } from '../../../../models/apflora/index.js'

interface IdealbiotopQueryResult {
  data?: {
    allIdealbiotops?: {
      nodes: Idealbiotop[]
    }
  }
}

export const Component = () => {
  const { apId } = useParams()

  const { data, loading, error } = useQuery<IdealbiotopQueryResult>(query, {
    variables: {
      id: apId,
    },
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
