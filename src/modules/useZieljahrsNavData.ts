import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { countBy } from 'es-toolkit'
import { useAtomValue } from 'jotai'

import { store, treeZielGqlFilterForTreeAtom } from '../store/index.ts'

const getZieljahrsCount = (ziels) => {
  const jahrs = countBy(ziels, (e) => e.jahr)
  const count = Object.keys(jahrs).length
  return count
}

export const useZieljahrsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const zielGqlFilterForTree = useAtomValue(treeZielGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeZieljahrs', apId, zielGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeZieljahrsQuery($zielsFilter: ZielFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              zielsByApId {
                nodes {
                  id
                  jahr
                }
              }
              filteredZiels: zielsByApId(
                filter: $zielsFilter
                orderBy: [JAHR_ASC, LABEL_ASC]
              ) {
                nodes {
                  id
                  label
                  jahr
                }
              }
            }
          }
        `,
        variables: {
          zielsFilter: zielGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const ziels = data.apById.zielsByApId.nodes
  const filteredZiels = data.apById.filteredZiels?.nodes
  const zieljahrsCount = getZieljahrsCount(ziels)
  const countByJahr = countBy(filteredZiels, (e) => e.jahr)
  const unfilteredCountByJahr = countBy(ziels, (e) => e.jahr)

  // convert into array of objects with id=jahr and count
  const menus = Object.keys(countByJahr).map((jahr) => ({
    id: +jahr,
    label: `${jahr} (${countByJahr[jahr]}/${unfilteredCountByJahr[jahr]})`,
    jahr: +jahr,
    treeNodeType: 'folder',
    treeMenuType: 'zieljahrFolder',
    treeId: `${apId}ZielJahreFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', +jahr],
    fetcherName: 'useZielsOfJahrNavData',
    fetcherParams: { projId, apId, jahr: +jahr },
    hasChildren: !!countByJahr[jahr],
  }))

  const navData = {
    id: 'AP-Ziele',
    label: `AP-Ziele Jahre (${menus.length}/${zieljahrsCount})`,
    listFilter: 'ziel',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele`,
    treeNodeType: 'folder',
    treeMenuType: 'zieljahrsFolder',
    treeId: `${apId}ZieljahrsFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
    hasChildren: !!zieljahrsCount,
    fetcherName: 'useZieljahrsNavData',
    fetcherParams: { projId, apId },
    menus,
  }

  return navData
}
