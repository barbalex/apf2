import { memo, useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { jwtDecode } from 'jwt-decode'

import { Projekt } from './Projekt/index.jsx'
import { WerteFolder } from './Werte/index.jsx'
import { CurrentIssuesFolder } from './CurrentIssues/index.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { NodeWithList } from '../NodeWithList.jsx'
import { RootNode } from '../RootNode.jsx'
import { useUsersNavData } from '../../../../../modules/useUsersNavData.js'
import { useMessagesNavData } from '../../../../../modules/useMessagesNavData.js'
import { useProjektNavData } from '../../../../../modules/useProjektNavData.js'

export const Root = memo(
  observer(() => {
    const client = useApolloClient()

    const store = useContext(MobxContext)
    const { projectIsOpen, nodeLabelFilter, apGqlFilterForTree } = store.tree
    const token = store.user?.token
    const role = token ? jwtDecode(token).role : null

    const apberuebersichtsFilter = {
      projId: { in: ['e57f56f4-4376-11e8-ab21-4314b6749d13'] },
    }
    if (nodeLabelFilter.apberuebersicht) {
      apberuebersichtsFilter.label = {
        includesInsensitive: nodeLabelFilter.apberuebersicht,
      }
    }
    const apsFilter = apGqlFilterForTree

    const { data, isLoading } = useQuery({
      queryKey: [
        'treeRoot',
        projectIsOpen,
        apsFilter,
        nodeLabelFilter.apberuebersicht,
      ],
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      queryFn: () =>
        client.query({
          query: gql`
            query TreeRootQuery(
              $apsFilter: ApFilter!
              $apberuebersichtsFilter: ApberuebersichtFilter!
              $projectIsOpen: Boolean!
            ) {
              allProjekts {
                nodes {
                  id
                  label
                  apberuebersichtsByProjId @include(if: $projectIsOpen) {
                    totalCount
                  }
                  filteredApberuebersichts: apberuebersichtsByProjId(
                    filter: $apberuebersichtsFilter
                  ) @include(if: $projectIsOpen) {
                    totalCount
                  }
                  apsByProjId @include(if: $projectIsOpen) {
                    totalCount
                  }
                  apsFiltered: apsByProjId(filter: $apsFilter)
                    @include(if: $projectIsOpen) {
                    totalCount
                  }
                }
              }
              allCurrentissues {
                totalCount
              }
            }
          `,
          variables: {
            apsFilter,
            apberuebersichtsFilter,
            projectIsOpen,
          },
          fetchPolicy: 'no-cache',
        }),
    })

    // console.log('TreeComponents rendering', {
    //   data,
    //   apsFilter,
    //   apberuebersichtsFilter,
    //   projectIsOpen,
    //   nodeLabelFilter,
    // })

    //console.log('Tree, height:', { height, initialTopMostIndex })

    if (!data) return null

    return (
      <>
        <Projekt
          projekt={data?.data?.allProjekts?.nodes?.[0]}
          isLoading={isLoading}
          projectIsOpen={projectIsOpen}
        />
        {/* TODO: fetcher is always undefined. IMPOSSIBLE */}
        <RootNode fetcher={useProjektNavData} />
        <RootNode fetcher={useUsersNavData} />
        {role === 'apflora_manager' && <WerteFolder />}
        <RootNode fetcher={useMessagesNavData} />
        <CurrentIssuesFolder
          count={data?.data?.allCurrentissues?.totalCount ?? 0}
          isLoading
        />
      </>
    )
  }),
)
