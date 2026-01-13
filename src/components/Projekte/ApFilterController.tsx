import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { MobxContext } from '../../mobxContext.js'

import type { ApId } from '../../models/apflora/public/Ap.ts'

interface ApFilterControllerQueryResult {
  apById: {
    id: ApId
    bearbeitung: number | null
  }
}

export const ApFilterController = observer(() => {
  const apolloClient = useApolloClient()
  const { apId } = useParams()
  const store = useContext(MobxContext)
  const { apFilter, setApFilter } = store.tree

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
})
