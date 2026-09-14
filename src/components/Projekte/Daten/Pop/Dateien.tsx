import { useParams } from 'react-router'
import { graphql } from '../../../../gql'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { PopId } from '../../../../models/apflora/index.ts'

interface PopQueryResult {
  popById?: {
    id: PopId
    label: string | null
  }
}

const query = graphql(`
  query popByIdForPopDateienQuery($id: UUID!) {
    popById(id: $id) {
      id
      label
    }
  }
`)

export const Component = () => {
  const { popId } = useParams()
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['pop', popId, 'label'],
    queryFn: async () => {
      const result = await apolloClient.query<PopQueryResult>({
        query,
        variables: { id: popId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

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
