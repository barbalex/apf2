import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../storeContext.js'

export const useBeobZugeordnetsNavData = (props) => {
  const apolloClient = useApolloClient()
  const store = useContext(MobxContext)

  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeBeobZugeordnets',
      apId,
      store.tree.beobZugeordnetGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavBeobZugeordnetsQuery(
            $beobZugeordnetFilter: BeobFilter!
            $allBeobZugeordnetFilter: BeobFilter!
          ) {
            beobsZugeordnet: allBeobs(filter: $allBeobZugeordnetFilter) {
              totalCount
            }
            filteredBeobsZugeordnet: allBeobs(
              filter: $beobZugeordnetFilter
              orderBy: [DATUM_DESC, AUTOR_ASC]
            ) {
              totalCount
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          beobZugeordnetFilter: {
            ...store.tree.beobZugeordnetGqlFilterForTree,
            tpopId: { equalTo: tpopId },
          },
          allBeobZugeordnetFilter: { tpopId: { equalTo: tpopId } },
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.beobZugeordnetGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.beobsZugeordnet?.totalCount ?? 0
  const filteredCount = data?.data?.filteredBeobsZugeordnet?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Beobachtungen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen`,
      label: `Beobachtungen zugeordnet (${isLoading ? '...' : `${filteredCount}/${count}`})`,
      labelShort: `Beob. zugeordnet (${isLoading ? '...' : `${filteredCount}/${count}`})`,
      // leave totalCount undefined as the menus are folders
      menus:
        data?.data?.filteredBeobsZugeordnet?.nodes?.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [
      apId,
      count,
      data?.data?.filteredBeobsZugeordnet?.nodes,
      filteredCount,
      isLoading,
      popId,
      projId,
      tpopId,
    ],
  )

  return { isLoading, error, navData }
}
