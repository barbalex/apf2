import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../../../../../../storeContext'
import TpopFolder from './Tpop'

const PopFolders = ({ projekt, ap, pop }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { tpopGqlFilterForTree, nodeLabelFilter } = store.tree

  const popbersFilter = { popId: { equalTo: pop.id } }
  if (nodeLabelFilter.popber) {
    popbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popber,
    }
  }
  const popmassnbersFilter = { popId: { equalTo: pop.id } }
  if (nodeLabelFilter.popmassnber) {
    popmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['treePop', pop.id],
    queryFn: () =>
      client.query({
        query: gql`
          query TreePopQuery(
            $id: UUID!
            $tpopsFilter: TpopFilter!
            $popbersFilter: PopberFilter!
            $popmassnbersFilter: PopmassnberFilter!
          ) {
            popById(id: $id) {
              id
              tpopsByPopId(filter: $tpopsFilter) {
                totalCount
              }
              popmassnbersByPopId(filter: $popmassnbersFilter) {
                totalCount
              }
              popbersByPopId(filter: $popbersFilter) {
                totalCount
              }
            }
          }
        `,
        variables: {
          id: pop.id,
          tpopsFilter: tpopGqlFilterForTree,
          popbersFilter,
          popmassnbersFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const tpopCount = data?.data?.popById?.tpopsByPopId?.totalCount ?? 0
  const popmassnberCount =
    data?.data?.popById?.popmassnbersByPopId?.totalCount ?? 0
  const popberCount = data?.data?.popById?.popbersByPopId?.totalCount ?? 0

  return (
    <>
      <TpopFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        isLoading={isLoading}
        count={tpopCount}
      />
    </>
  )
}

export default observer(PopFolders)
