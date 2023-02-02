import { useContext } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import buildTreeQueryVariables from '../buildTreeQueryVariables'
import Projekt from './Projekt'
import UserFolder from './UserFolder'
import Messages from './Messages'
import WlFolder from './WlFolder'
import CurrentIssue from './CurrentIssue'
import storeContext from '../../../../storeContext'

const NodeComponents = ({ role }) => {
  const store = useContext(storeContext)
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

  const { data, isLoading } = useQuery({
    queryKey: [
      'treeRoot',
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

  if (!data) return null

  return (
    <>
      <Projekt
        treeQueryVariables={treeQueryVariables}
        projekt={data?.data?.allProjekts?.nodes[0]}
        isProjectOpen={isProjectOpen}
      />
      <UserFolder
        treeQueryVariables={treeQueryVariables}
        count={data?.data?.allUsers?.totalCount ?? 0}
        isLoading={isLoading}
      />
      {role === 'apflora_manager' && (
        <WlFolder treeQueryVariables={treeQueryVariables} />
      )}
      <Messages
        count={data?.data?.allMessages?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <CurrentIssue
        treeQueryVariables={treeQueryVariables}
        count={data?.data?.allCurrentissues?.totalCount ?? 0}
        isLoading
      />
    </>
  )
}

export default NodeComponents
