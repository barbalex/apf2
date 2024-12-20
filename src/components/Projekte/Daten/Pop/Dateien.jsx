import { memo } from 'react'
import { useParams } from 'react-router'
import { useApolloClient, useQuery, gql } from '@apollo/client'

import { FilesRouter } from '../../../shared/Files/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

export const Component = memo(() => {
  const { popId } = useParams()

  const client = useApolloClient()
  const { data } = useQuery(
    gql`
      query popByIdForPopDateienQuery($id: UUID!) {
        popById(id: $id) {
          id
          label
        }
      }
    `,
    {
      variables: { id: popId },
    },
  )
  const label = data?.popById?.label ?? 'Population'

  return (
    <>
      <FormTitle title={`${label}: Dateien`} />
      <FilesRouter
        parentId={popId}
        parent="pop"
      />
    </>
  )
})
