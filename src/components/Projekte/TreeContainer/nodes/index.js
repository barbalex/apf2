import { getSnapshot } from 'mobx-state-tree'

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

  const projektNodes = await buildProjektNodes({
    store,
    treeQueryVariables,
  })
  const userFolderNodes = await buildUserFolderNodes({
    store,
    treeQueryVariables,
  })
  const messagesFolderNodes = await buildMessagesFolderNodes({ store })
  const currentIssuesFolderNodes = await buildCurrentIssuesFolderNodes({
    store,
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
