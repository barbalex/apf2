import { memo, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useApolloClient, useQuery } from '@apollo/client'

import { Files } from '../../../shared/Files/index.jsx'
import { query } from './query.js'

export const Component = memo(() => {
  const { apId } = useParams()
  const client = useApolloClient()

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: apId,
    },
  })

  const row = useMemo(
    () => data?.allIdealbiotops?.nodes?.[0] ?? {},
    [data?.allIdealbiotops?.nodes],
  )

  console.log('Idealbiotop/Dateien', { apId, row, data })

  return (
    <Files
      parentId={row.id}
      parent="idealbiotop"
    />
  )
})