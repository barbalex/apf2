import { getSnapshot } from 'mobx-state-tree'
import { gql } from '@apollo/client'

import buildProjektNode from './projekt'
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
    queryKey: ['treeRoot', isProjectOpen, treeQueryVariables.apsFilter],
    queryFn: async () =>
      store.client.query({
        query: gql`
          query TreeRootFolderQuery(
            $apsFilter: ApFilter!
            $isProjectOpen: Boolean!
          ) {
            allProjekts {
              nodes {
                id
                label
                apsByProjId(filter: $apsFilter) @include(if: $isProjectOpen) {
                  totalCount
                }
              }
            }
          }
        `,
        variables: {
          apsFilter: treeQueryVariables.apsFilter,
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

  let nodes = [projektNode]

  return nodes
}

export default nodes
