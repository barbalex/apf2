import { useMemo, useEffect, useState, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { autorun } from 'mobx'
import { atom, useAtom } from 'jotai'

import { StoreContext } from '../storeContext.js'

const filterAtom = atom()

export const useApberuebersichtsNavData = ({
  projId: projIdPassedIn,
  // apberuebersichtGqlFilterForTree,
}) => {
  const apolloClient = useApolloClient()
  const store = useContext(StoreContext)

  const { projId: projIdFromParams } = useParams()
  const projId = projIdPassedIn ?? projIdFromParams

  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // TODO: this is not working yet
  const [filter, setFilter] = useAtom(filterAtom)
  useEffect(() => {
    setFilter(store.tree.apberuebersichtGqlFilterForTree)
  }, [])

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
          apberuebersichtFilter:
            filter ?? store.tree.apberuebersichtGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () =>
      autorun(() => {
        console.log(
          'useApberuebersichtsNavData autorun, apberuebersichtGqlFilterForTree:',
          store.tree.apberuebersichtGqlFilterForTree,
        )
        setFilter(store.tree.apberuebersichtGqlFilterForTree)
        setTimeout(() => {
          refetch()
        }, 300)
      }),
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
  console.log('useApberuebersichtsNavData', {
    filter,
    navData,
    menusLength: navData.menus.length,
  })

  return { isLoading, error, navData }
}
