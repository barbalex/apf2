import { useParams } from 'react-router'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'

const apFilesQuery = gql`
  query apFilesQuery($apId: UUID!) {
    apById(id: $apId) {
      id
      aeTaxonomyByArtId {
        id
        artname
      }
    }
  }
`

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
  const { data } = useQuery({
    queryKey: ['apFiles', apId],
    queryFn: async () => {
      const result = await apolloClient.query<ApFilesQueryResult>({
        query: apFilesQuery,
        variables: { apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
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
