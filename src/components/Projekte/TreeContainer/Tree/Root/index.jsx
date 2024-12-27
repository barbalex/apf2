import { memo, useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { jwtDecode } from 'jwt-decode'

import { Projekt } from './Projekt/index.jsx'
import { UsersFolder } from './Users.jsx'
import { MessagesFolder } from './Messages.jsx'
import { WerteFolder } from './Werte/index.jsx'
import { CurrentIssuesFolder } from './CurrentIssues/index.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { NodeWithList } from '../NodeWithList.jsx'

export const Root = memo(
  observer(() => {
    const client = useApolloClient()

    const store = useContext(MobxContext)
    const { projectIsOpen, nodeLabelFilter, apGqlFilterForTree } = store.tree
    const token = store.user?.token
    const role = token ? jwtDecode(token).role : null

    const usersFilter = { id: { isNull: false } }
    if (nodeLabelFilter.user) {
      usersFilter.label = {
        includesInsensitive: nodeLabelFilter.user,
      }
    }
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
        nodeLabelFilter.user,
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
              $usersFilter: UserFilter!
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
              allMessages {
                totalCount
              }
              allUsers {
                totalCount
              }
              filteredUsers: allUsers(filter: $usersFilter) {
                totalCount
              }
            }
          `,
          variables: {
            usersFilter,
            apsFilter,
            apberuebersichtsFilter,
            projectIsOpen,
          },
          fetchPolicy: 'no-cache',
        }),
    })

    // console.log('TreeComponents rendering', {
    //   data,
    //   usersFilter,
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
        <UsersFolder
          count={data?.data?.allUsers?.totalCount ?? 0}
          countFiltered={data?.data?.filteredUsers?.totalCount ?? 0}
          isLoading={isLoading}
          usersFilter={usersFilter}
        />
        {role === 'apflora_manager' && <WerteFolder />}
        <MessagesFolder
          count={data?.data?.allMessages?.totalCount ?? 0}
          isLoading={isLoading}
        />
        <CurrentIssuesFolder
          count={data?.data?.allCurrentissues?.totalCount ?? 0}
          isLoading
        />
      </>
    )
  }),
)
