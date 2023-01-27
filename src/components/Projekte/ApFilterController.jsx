import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { useApolloClient, gql } from '@apollo/client'

import storeContext from '../../storeContext'

const ApFilterController = () => {
  const client = useApolloClient()
  const { apId } = useParams()
  const store = useContext(storeContext)
  const { apFilter, setApFilter } = store.tree

  useEffect(() => {
    // if active apId is not an ap and apFilte is true,
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
}

export default observer(ApFilterController)
