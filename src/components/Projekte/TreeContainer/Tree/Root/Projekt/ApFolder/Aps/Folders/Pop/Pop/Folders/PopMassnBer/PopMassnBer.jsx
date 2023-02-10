import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../storeContext'

const PopMassnBer = ({ projekt, ap, pop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const popmassnbersFilter = { popId: { equalTo: pop.id } }
  if (nodeLabelFilter.popmassnber) {
    popmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }

  const { data } = useQuery({
    queryKey: ['treePopmassnber', pop.id, popmassnbersFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopmassnberQuery(
            $id: UUID!
            $popmassnbersFilter: PopmassnberFilter!
          ) {
            popById(id: $id) {
              id
              popmassnbersByPopId(
                filter: $popmassnbersFilter
                orderBy: LABEL_ASC
              ) {
                nodes {
                  id
                  label
                }
              }
            }
          }
        `,
        variables: {
          id: pop.id,
          popmassnbersFilter,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.popById?.popmassnbersByPopId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'popmassnber',
      id: el.id,
      parentId: pop.id,
      parentTableId: pop.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Massnahmen-Berichte',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(PopMassnBer)
