import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'
import { useApartsNavData } from '../../../../../../../../../../modules/useApartsNavData.js'

export const ApArt = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(MobxContext)
    const { apartGqlFilterForTree } = store.tree

    const { navData } = useApartsNavData({
      projId: projekt.id,
      apId: ap.id,
    })

    return navData.menus.map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'apart',
        id: el.id,
        parentId: ap.id,
        parentTableId: ap.id,
        urlLabel: el.id,
        label: el.label,
        url: ['Projekte', projekt.id, 'Arten', ap.id, 'Taxa', el.id],
        hasChildren: false,
      }

      return (
        <Row
          key={el.id}
          node={node}
        />
      )
    })
  }),
)
