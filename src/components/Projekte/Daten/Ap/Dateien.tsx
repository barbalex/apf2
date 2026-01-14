import { useParams } from 'react-router'
import { gql } from '@apollo/client'

import { useQuery } from '@apollo/client/react'

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
  const { apId } = useParams<{ apId: string }>()
  const { data } = useQuery<ApFilesQueryResult>(apFilesQuery, {
    variables: { apId },
  })

  const artname = data?.apById?.aeTaxonomyByArtId?.artname ?? 'Art'

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
