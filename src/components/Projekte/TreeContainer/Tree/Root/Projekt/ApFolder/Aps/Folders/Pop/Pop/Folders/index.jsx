import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../../../../../../../storeContext.js'
import { TpopFolder } from './Tpop/index.jsx'
import { PopBerFolder } from './PopBer/index.jsx'
import { PopMassnBerFolder } from './PopMassnBer/index.jsx'

export const PopFolders = observer(({ projekt, ap, pop }) => {
  const client = useApolloClient()

  const store = useContext(StoreContext)
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
    queryKey: [
      'treePopFolders',
      pop.id,
      tpopGqlFilterForTree,
      popbersFilter,
      popmassnbersFilter,
    ],
    queryFn: () =>
      client.query({
        query: gql`
          query TreePopFoldersQuery(
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
      <PopBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        isLoading={isLoading}
        count={popberCount}
      />
      <PopMassnBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        isLoading={isLoading}
        count={popmassnberCount}
      />
    </>
  )
})
