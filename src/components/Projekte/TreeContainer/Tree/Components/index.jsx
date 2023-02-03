import { useContext } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import Projekt from './Projekt'
import Users from './Users'
import Messages from './Messages'
import Werte from './Werte'
import CurrentIssues from './CurrentIssues'
import storeContext from '../../../../../storeContext'

const NodeComponents = ({ role }) => {
  const store = useContext(storeContext)
  const nodeLabelFilter = getSnapshot(store.tree.nodeLabelFilter)
  const openNodes = getSnapshot(store.tree.openNodes)
  const apGqlFilter = store.tree.apGqlFilter

  const isProjectOpen =
    openNodes.filter((n) => n[0] === 'Projekte' && !!n[1]).length > 0

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
      isProjectOpen,
      usersFilter,
      apsFilter,
      apberuebersichtsFilter,
    ],
    queryFn: async () =>
      store.client.query({
        query: gql`
          query TreeRootFolderQuery(
            $usersFilter: UserFilter!
            $apsFilter: ApFilter!
            $apberuebersichtsFilter: ApberuebersichtFilter!
            $isProjectOpen: Boolean!
          ) {
            allProjekts {
              nodes {
                id
                label
                apberuebersichtsByProjId(filter: $apberuebersichtsFilter)
                  @include(if: $isProjectOpen) {
                  totalCount
                }
                apsByProjId(filter: $apsFilter) @include(if: $isProjectOpen) {
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
          isProjectOpen,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  console.log('TreeComponents rendering')

  if (!data) return null

  return (
    <>
      <Projekt
        key={`e57f56f4-4376-11e8-ab21-4314b6749d13`}
        projekt={data?.data?.allProjekts?.nodes?.[0]}
        isProjectOpen={isProjectOpen}
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

export default observer(NodeComponents)
