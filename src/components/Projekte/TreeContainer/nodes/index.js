import { getSnapshot } from 'mobx-state-tree'
import { gql } from '@apollo/client'

import buildProjektNodes from './projekt'
import buildUserFolderNodes from './userFolder'
import buildCurrentIssuesFolderNodes from './currentIssuesFolder'
import buildMessagesFolderNodes from './messagesFolder'
import buildWlFolderNodes from './wlFolder'
import buildTreeQueryVariables from '../buildTreeQueryVariables'

const nodes = async ({ store, role }) => {
  const nodeLabelFilter = getSnapshot(store.tree.nodeLabelFilter)
  const openNodes = getSnapshot(store.tree.openNodes)
  const popGqlFilter = store.tree.popGqlFilter
  const apGqlFilter = store.tree.apGqlFilter
  const tpopGqlFilter = store.tree.tpopGqlFilter
  const tpopmassnGqlFilter = store.tree.tpopmassnGqlFilter
  const ekGqlFilter = store.tree.ekGqlFilter
  const ekfGqlFilter = store.tree.ekfGqlFilter
  const beobGqlFilter = store.tree.beobGqlFilter
  const openAps = store.tree.openAps

  const treeQueryVariables = buildTreeQueryVariables({
    openNodes,
    nodeLabelFilter,
    popGqlFilter,
    tpopGqlFilter,
    tpopmassnGqlFilter,
    ekGqlFilter,
    ekfGqlFilter,
    apGqlFilter,
    beobGqlFilter,
    openAps,
  })

  const { data, isLoading } = await store.queryClient.fetchQuery({
    queryKey: ['treeRootFolder'],
    queryFn: async () =>
      store.client.query({
        query: gql`
          query TreeRootFolderQuery($usersFilter: UserFilter!) {
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
        variables: { usersFilter: treeQueryVariables.usersFilter },
        fetchPolicy: 'no-cache',
      }),
  })

  const projektNodes = await buildProjektNodes({
    store,
    treeQueryVariables,
  })
  const userFolderNodes = await buildUserFolderNodes({
    store,
    treeQueryVariables,
    count: data?.allUsers?.totalCount ?? 0,
  })
  const messagesFolderNodes = await buildMessagesFolderNodes({
    count: data?.allMessages?.totalCount ?? 0,
    isLoading,
  })
  const currentIssuesFolderNodes = await buildCurrentIssuesFolderNodes({
    store,
    count: data?.allCurrentissues?.totalCount ?? 0,
    isLoading,
    treeQueryVariables,
  })
  const wlFolderNodes =
    role === 'apflora_manager'
      ? await buildWlFolderNodes({ treeQueryVariables, store })
      : []

  let nodes = [
    ...projektNodes,
    ...userFolderNodes,
    ...wlFolderNodes,
    ...messagesFolderNodes,
    ...currentIssuesFolderNodes,
  ]

  return nodes
}

export default nodes
