import { memo, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { useApolloClient, gql } from '@apollo/client'

import { StoreContext } from '../../storeContext.js'

export const ApFilterController = memo(
  observer(() => {
    const client = useApolloClient()
    const { apId } = useParams()
    const store = useContext(StoreContext)
    const { apFilter, setApFilter } = store.tree

    useEffect(() => {
      // if active apId is not an ap and apFilter is true,
      // turn apFilter off to show the active path
      if (!apId) return
      if (!apFilter) return

      client
        .query({
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
    }, [apFilter, apId, client, setApFilter])

    return null
  }),
)
