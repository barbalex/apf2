import React, { useContext, useEffect, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
// 2022 02 08: removed simplebar as was hard to get to work with virtuoso
// see: https://github.com/petyosi/react-virtuoso/issues/253
// import { Virtuoso } from 'react-virtuoso'
import { Tree } from 'react-arborist'
// import AutoSizer from 'react-virtualized-auto-sizer'
import { useResizeDetector } from 'react-resize-detector'
import { getSnapshot } from 'mobx-state-tree'
import { useDebouncedCallback } from 'use-debounce'
import jwtDecode from 'jwt-decode'
import { useParams } from 'react-router-dom'

import Components from '../Components'

import storeContext from '../../../../storeContext'
import buildNodes from '../nodes'

const Container = styled.div`
  height: calc(100% - 53px - 8px);
  width: 100%;

  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`

const TreeComponent = () => {
  const params = useParams()

  const store = useContext(storeContext)
  const { user } = store
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const tree = store.tree
  const {
    activeNodeArray,
    lastTouchedNode: lastTouchedNodeProxy,
    refetcher,
  } = tree

  const {
    height = 500,
    width = 500,
    ref: resizeRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
    refreshOptions: { leading: true },
  })

  const dataFilter = getSnapshot(store.tree.dataFilter)
  const openNodes = getSnapshot(store.tree.openNodes)
  const nodeLabelFilter = getSnapshot(store.tree.nodeLabelFilter)
  const popGqlFilter = store.tree.popGqlFilter
  const apGqlFilter = store.tree.apGqlFilter
  const tpopGqlFilter = store.tree.tpopGqlFilter
  const tpopmassnGqlFilter = store.tree.tpopmassnGqlFilter
  const ekGqlFilter = store.tree.ekGqlFilter
  const ekfGqlFilter = store.tree.ekfGqlFilter
  const beobGqlFilter = store.tree.beobGqlFilter
  const openAps = store.tree.openAps

  const [treeNodes, setTreeNodes] = useState([])

  // need to debounce building nodes because:
  // sometimes navigation and activeNodeArray-Setting happen right after each other
  const buildNodesCallback = useCallback(async () => {
    console.log('TreeContainer building nodes')
    const nodes = await buildNodes({
      store,
      role,
    })
    setTreeNodes(nodes)
  }, [role, store])
  const buildNodesDebounced = useDebouncedCallback(buildNodesCallback, 0)

  useEffect(() => {
    buildNodesDebounced()
  }, [
    openNodes,
    openNodes.length,
    dataFilter,
    role,
    store,
    params,
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
    buildNodesDebounced,
    refetcher,
  ])

  const lastTouchedNode = lastTouchedNodeProxy?.slice()
  // when loading on url, lastTouchedNode may not be set
  const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray
  const [initialTopMostIndex, setInitialTopMostIndex] = useState(undefined)

  useEffect(() => {
    const index = findIndex(treeNodes, (node) => isEqual(node.url, urlToFocus))
    const indexToSet = index === -1 ? 0 : index
    //console.log('Tree, effect:', { nodes, index, urlToFocus, indexToSet })
    if (initialTopMostIndex === undefined) {
      setInitialTopMostIndex(indexToSet)
    }
  }, [treeNodes, urlToFocus, initialTopMostIndex])

  //console.log('Tree, height:', { height, initialTopMostIndex })

  // only return once initial top most index is clear (better performance)
  if (initialTopMostIndex === undefined) return null

  return (
    <Container ref={resizeRef}>
      <Components />
    </Container>
  )
}

export default observer(TreeComponent)
