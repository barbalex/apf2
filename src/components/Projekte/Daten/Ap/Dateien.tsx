import { useParams } from 'react-router'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'

const apFilesQuery = graphql(`
  query apFilesQuery($apId: UUID!) {
    apById(id: $apId) {
      id
      aeTaxonomyByArtId {
        id
        artname
      }
    }
  }
`)

interface ApFilesQueryResult {
  apById: {
    id: ApId
    aeTaxonomyByArtId: {
      id: AeTaxonomiesId
      artname: string
    } | null
  }
}

export const Component = () => {
  const apolloClient = useApolloClient()

  const { apId } = useParams<{ apId: string }>()
  const { data } = useSuspenseQuery({
    queryKey: ['apFiles', apId],
    queryFn: async () => {
      const result = await apolloClient.query<ApFilesQueryResult>({
        query: apFilesQuery,
        variables: { apId: apId ?? '' },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as ApFilesQueryResult
    },
  })

  const artname = data.apById?.aeTaxonomyByArtId?.artname ?? 'Art'

  return (
    <>
      <FormTitle title={`${artname}: Dateien`} />
      <FilesRouter
        parentId={apId}
        parent="ap"
      />
    </>
  )
}
