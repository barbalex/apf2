import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useApberuebersichtsNavData = () => {
  const apolloClient = useApolloClient()
  const store = useContext(StoreContext)

  const { projId } = useParams()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeApberuebersichts', projId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavApberuebersichtsQuery(
            $projId: UUID!
            $apberuebersichtFilter: ApberuebersichtFilter!
          ) {
            projektById(id: $projId) {
              id
              apberuebersichtsByProjId(filter: $apberuebersichtFilter) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              allApberuebersichts: apberuebersichtsByProjId {
                totalCount
              }
            }
          }
        `,
        variables: {
          projId,
          apberuebersichtFilter: store.tree.apberuebersichtGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.apberuebersichtGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const navData = useMemo(
    () => ({
      id: 'projekte',
      url: `/Daten/Projekte/${projId}/AP-Berichte`,
      label: 'AP-Berichte',
      totalCount: data?.data?.projektById?.allApberuebersichts?.totalCount ?? 0,
      menus:
        data?.data?.projektById?.apberuebersichtsByProjId?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [
      data?.data?.projektById?.allApberuebersichts?.totalCount,
      data?.data?.projektById?.apberuebersichtsByProjId?.nodes,
      projId,
    ],
  )

  return { isLoading, error, navData }
}
