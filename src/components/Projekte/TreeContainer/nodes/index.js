import { getSnapshot } from 'mobx-state-tree'
import { gql } from '@apollo/client'

import buildProjektNode from './projekt'
import buildUserFolderNode from './userFolder'
import buildCurrentIssuesFolderNode from './currentIssuesFolder'
import buildMessagesFolderNode from './messagesFolder'
import buildWlFolderNode from './wlFolder'
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

  const openProjects = openNodes.filter((n) => n[0] === 'Projekte' && !!n[1])
  const isProjectOpen = openProjects.length > 0

  const { data, isLoading } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeRootFolder',
      isProjectOpen,
      treeQueryVariables.usersFilter,
      treeQueryVariables.apsFilter,
      treeQueryVariables.apberuebersichtsFilter,
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
          usersFilter: treeQueryVariables.usersFilter,
          apsFilter: treeQueryVariables.apsFilter,
          apberuebersichtsFilter: treeQueryVariables.apberuebersichtsFilter,
          isProjectOpen,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const projektNode = await buildProjektNode({
    store,
    treeQueryVariables,
    projekt: data?.allProjekts?.nodes[0],
    isProjectOpen,
  })
  const userFolderNode = await buildUserFolderNode({
    store,
    treeQueryVariables,
    count: data?.allUsers?.totalCount ?? 0,
  })
  const messagesFolderNode = await buildMessagesFolderNode({
    count: data?.allMessages?.totalCount ?? 0,
    isLoading,
  })
  const currentIssuesFolderNode = await buildCurrentIssuesFolderNode({
    store,
    count: data?.allCurrentissues?.totalCount ?? 0,
    isLoading,
    treeQueryVariables,
  })
  const wlFolderNode =
    role === 'apflora_manager'
      ? await buildWlFolderNode({ treeQueryVariables, store })
      : []

  let nodes = [
    projektNode,
    userFolderNode,
    wlFolderNode,
    messagesFolderNode,
    currentIssuesFolderNode,
  ]

  return nodes
}

export default nodes
