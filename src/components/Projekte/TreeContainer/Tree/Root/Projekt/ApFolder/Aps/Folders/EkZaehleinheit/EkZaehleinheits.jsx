import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { createEkzaehleinheitsQuery } from '../../../../../../../../../../modules/createEkzaehleinheitsQuery.js'

export const EkZaehleinheits = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { nodeLabelFilter, ekzaehleinheitGqlFilterForTree } = store.tree

    const ekzaehleinheitsFilter = { apId: { equalTo: ap.id } }
    if (nodeLabelFilter.ekzaehleinheit) {
      ekzaehleinheitsFilter.label = {
        includesInsensitive: nodeLabelFilter.ekzaehleinheit,
      }
    }

    const { data } = useQuery(
      createEkzaehleinheitsQuery({
        apId: ap.id,
        ekzaehleinheitGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.apById?.ekzaehleinheitsByApId?.nodes ?? []).map(
      (el) => {
        const node = {
          nodeType: 'table',
          menuType: 'ekzaehleinheit',
          id: el.id,
          parentId: ap.id,
          parentTableId: ap.id,
          urlLabel: el.id,
          label: el.label,
          url: [
            'Projekte',
            projekt.id,
            'Arten',
            ap.id,
            'EK-Zähleinheiten',
            el.id,
          ],
          hasChildren: false,
        }

        return (
          <Row
            key={el.id}
            node={node}
          />
        )
      },
    )
  }),
)
