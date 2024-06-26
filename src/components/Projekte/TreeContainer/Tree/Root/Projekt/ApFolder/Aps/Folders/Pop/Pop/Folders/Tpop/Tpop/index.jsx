import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../storeContext.js'
import Folders from './Folders'

const Tpop = ({ projekt, ap, pop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { tpopGqlFilterForTree } = store.tree

  const { data } = useQuery({
    queryKey: ['treeTpop', pop.id, tpopGqlFilterForTree],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopQuery($id: UUID!, $tpopsFilter: TpopFilter!) {
            popById(id: $id) {
              id
              tpopsByPopId(
                filter: $tpopsFilter
                orderBy: [NR_ASC, FLURNAME_ASC]
              ) {
                nodes {
                  id
                  label
                  status
                }
              }
            }
          }
        `,
        variables: {
          id: pop.id,
          tpopsFilter: tpopGqlFilterForTree,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.popById?.tpopsByPopId?.nodes ?? []).map((el) => {
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Teil-Populationen' &&
          n[7] === el.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpop',
      id: el.id,
      parentId: `${pop.id}TpopFolder`,
      parentTableId: pop.id,
      urlLabel: el.id,
      label: el.label,
      status: el.status,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        el.id,
      ],
      hasChildren: true,
    }

    return (
      <div key={el.id}>
        <Row node={node} />
        {isOpen && <Folders projekt={projekt} ap={ap} pop={pop} tpop={el} />}
      </div>
    )
  })
}

export default observer(Tpop)
