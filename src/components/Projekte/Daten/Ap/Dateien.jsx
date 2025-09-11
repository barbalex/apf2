import { memo } from 'react'
import { useParams } from 'react-router'
import { gql } from '@apollo/client';

import { useQuery } from "@apollo/client/react";

import { FilesRouter } from '../../../shared/Files/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

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

export const Component = memo(() => {
  const { apId } = useParams()
  const { data } = useQuery(apFilesQuery, {
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
})
