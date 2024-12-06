import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useProjektNavData = () => {
  const apolloClient = useApolloClient()
  const { projId } = useParams()

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeProject', projId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavProjectQuery(
            $projId: UUID!
            $apFilter: ApFilter!
            $apberuebersichtFilter: ApberuebersichtFilter!
          ) {
            projektById(id: $projId) {
              id
              label
              apberuebersichtsByProjId(filter: $apberuebersichtFilter) {
                totalCount
              }
              allApberuebersichts: apberuebersichtsByProjId {
                totalCount
              }
              apsByProjId(filter: $apFilter) {
                totalCount
              }
              allAps: apsByProjId {
                totalCount
              }
            }
          }
        `,
        variables: {
          projId,
          apFilter: store.tree.apGqlFilterForTree,
          apberuebersichtFilter: store.tree.apberuebersichtGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.apGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.apberuebersichtGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.projektById?.label ?? 'Projekt'
  const artsCount = data?.data?.projektById?.apsByProjId?.totalCount ?? 0
  const allArtsCount = data?.data?.projektById?.allAps?.totalCount ?? 0
  const apberuebersichtsCount =
    data?.data?.projektById?.apberuebersichtsByProjId?.totalCount ?? 0
  const allApberuebersichtsCount =
    data?.data?.projektById?.allApberuebersichts?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: projId,
      url: `/Daten/Projekte/${projId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Arten',
          label: `Arten (${isLoading ? '...' : `${artsCount}/${allArtsCount}`})`,
        },
        {
          id: 'AP-Berichte',
          label: `AP-Berichte (${isLoading ? '...' : `${apberuebersichtsCount}/${allApberuebersichtsCount}`})`,
        },
      ],
    }),
    [
      allApberuebersichtsCount,
      allArtsCount,
      apberuebersichtsCount,
      artsCount,
      isLoading,
      label,
      projId,
    ],
  )

  return { isLoading, error, navData }
}
