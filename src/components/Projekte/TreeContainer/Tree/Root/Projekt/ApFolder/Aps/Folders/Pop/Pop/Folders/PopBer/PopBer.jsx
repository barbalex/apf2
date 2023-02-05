import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../storeContext'

const PopBer = ({ projekt, ap, pop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const popbersFilter = { popId: { equalTo: pop.id } }
  if (nodeLabelFilter.popber) {
    popbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popber,
    }
  }

  const { data } = useQuery({
    queryKey: ['treePopber', ap.id, popbersFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreePopberQuery($id: UUID!, $popbersFilter: PopberFilter!) {
            popById(id: $id) {
              id
              popbersByPopId(filter: $popbersFilter, orderBy: LABEL_ASC) {
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
          popbersFilter,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.popById?.popbersByPopId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'popber',
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
        'Kontroll-Berichte',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(PopBer)
