import { useEffect } from 'react'
import { useParams } from 'react-router'
import { gql } from '@apollo/client'
import { useAtom } from 'jotai'

import { useApolloClient } from '@apollo/client/react'

import { treeApFilterAtom } from '../../store/index.ts'

import type { ApId } from '../../models/apflora/public/Ap.ts'

interface ApFilterControllerQueryResult {
  apById: {
    id: ApId
    bearbeitung: number | null
  }
}

export const ApFilterController = () => {
  const apolloClient = useApolloClient()
  const { apId } = useParams()
  const [apFilter, setApFilter] = useAtom(treeApFilterAtom)

  useEffect(() => {
    // if active apId is not an ap and apFilter is true,
    // turn apFilter off to show the active path
    if (!apId) return
    if (!apFilter) return

    apolloClient
      .query<ApFilterControllerQueryResult>({
        query: gql`
          query apFilterControllerQuery($id: UUID!) {
            apById(id: $id) {
              id
              bearbeitung
            }
          }
        `,
        variables: { id: apId },
      })
      .then(({ data }) => {
        const bearbeitung = data.apById.bearbeitung
        const isAp = bearbeitung > 0 && bearbeitung < 4
        if (!isAp) setApFilter(false)
      })
  }, [apFilter, apId, apolloClient, setApFilter])

  return null
}
