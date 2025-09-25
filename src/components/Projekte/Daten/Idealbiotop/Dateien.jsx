import { memo, useMemo } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@apollo/client/react'

import { FilesRouter } from '../../../shared/Files/index.jsx'
import { query } from './query.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

export const Component = memo(() => {
  const { apId } = useParams()

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: apId,
    },
  })

  const row = useMemo(
    () => data?.allIdealbiotops?.nodes?.[0] ?? {},
    [data?.allIdealbiotops?.nodes],
  )

  return (
    <>
      <FormTitle title="Dateien" />
      <FilesRouter
        parentId={row.id}
        parent="idealbiotop"
      />
    </>
  )
})
