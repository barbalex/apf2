import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import Projekt from './Projekt'
import Users from './Users'
import Messages from './Messages'
import Werte from './Werte'
import CurrentIssues from './CurrentIssues'
import storeContext from '../../../../../storeContext'

const TreeRoot = ({ role }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { projectIsOpen, nodeLabelFilter } = store.tree
  const apGqlFilter = store.tree.apGqlFilter

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
  const apsFilter = apGqlFilter.filtered

  const { data, isLoading } = useQuery({
    queryKey: [
      'treeRoot',
      projectIsOpen,
      usersFilter,
      apsFilter,
      apberuebersichtsFilter,
    ],
    queryFn: async () => {
      console.log('TreeRoot querying')
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

  console.log('TreeComponents rendering', {
    data,
    usersFilter,
    apsFilter,
    apberuebersichtsFilter,
    projectIsOpen,
    nodeLabelFilter,
  })

  if (!data) return null

  return (
    <>
      <Projekt
        key={`e57f56f4-4376-11e8-ab21-4314b6749d13`}
        projekt={data?.data?.allProjekts?.nodes?.[0]}
        projectIsOpen={projectIsOpen}
        apberuebersichtsFilter={apberuebersichtsFilter}
      />
      <Users
        key="users"
        count={data?.data?.allUsers?.totalCount ?? 0}
        isLoading={isLoading}
        usersFilter={usersFilter}
      />
      {role === 'apflora_manager' && <Werte />}
      <Messages
        key="messages"
        count={data?.data?.allMessages?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <CurrentIssues
        key="currentIssues"
        count={data?.data?.allCurrentissues?.totalCount ?? 0}
        isLoading
      />
    </>
  )
}

export default observer(TreeRoot)
