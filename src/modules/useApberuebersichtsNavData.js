import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

export const useApberuebersichtsNavData = (props) => {
  const apolloClient = useApolloClient()
  const store = useContext(MobxContext)

  const params = useParams()
  const projId = props?.projId ?? params?.projId

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeApberuebersicht', projId],
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

  const count =
    data?.data?.projektById?.apberuebersichtsByProjId?.nodes?.length ?? 0
  const totalCount =
    data?.data?.projektById?.allApberuebersichts?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'AP-Berichte',
      url: `/Daten/Projekte/${projId}/AP-Berichte`,
      label: 'AP-Berichte ' + (isLoading ? '...' : `${count}/${totalCount}`),
      // TODO: needed?
      totalCount,
      menus: (
        data?.data?.projektById?.apberuebersichtsByProjId?.nodes ?? []
      ).map((p) => ({
        id: p.id,
        label: p.label,
      })),
    }),
    [
      count,
      data?.data?.projektById?.apberuebersichtsByProjId?.nodes,
      isLoading,
      projId,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
