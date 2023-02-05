import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import jwtDecode from 'jwt-decode'

import Projekt from './Projekt'
import Users from './Users'
import Messages from './Messages'
import Werte from './Werte'
import CurrentIssues from './CurrentIssues'
import storeContext from '../../../../../storeContext'

const TreeRoot = () => {
  const client = useApolloClient()

  const store = useContext(storeContext)
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
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return client.query({
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
                apberuebersichtsByProjId(filter: $apberuebersichtsFilter)
                  @include(if: $projectIsOpen) {
                  totalCount
                }
                apsByProjId(filter: $apsFilter) @include(if: $projectIsOpen) {
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
            allUsers(filter: $usersFilter) {
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
      })
    },
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
        key={`root/e57f56f4-4376-11e8-ab21-4314b6749d13`}
        projekt={data?.data?.allProjekts?.nodes?.[0]}
        projectIsOpen={projectIsOpen}
        apberuebersichtsFilter={apberuebersichtsFilter}
      />
      <Users
        key="root/users"
        count={data?.data?.allUsers?.totalCount ?? 0}
        isLoading={isLoading}
        usersFilter={usersFilter}
      />
      {role === 'apflora_manager' && <Werte key="root/werte" />}
      <Messages
        key="root/messages"
        count={data?.data?.allMessages?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <CurrentIssues
        key="root/currentIssues"
        count={data?.data?.allCurrentissues?.totalCount ?? 0}
        isLoading
      />
    </>
  )
}

export default observer(TreeRoot)
