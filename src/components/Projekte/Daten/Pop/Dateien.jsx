import { useParams } from 'react-router'
import { gql } from '@apollo/client'

import { useQuery } from '@apollo/client/react'

import { FilesRouter } from '../../../shared/Files/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

export const Component = () => {
  const { popId } = useParams()

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
}
