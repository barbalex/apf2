/**
 * 2020.03.16:
 * used to build nodes in TreeContainer
 * but need to pass them to Daten
 * and react would not like this to happen from below
 * so needed to move building nodes up to here
 */
import React, { useContext, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import SplitPane from 'react-split-pane'
import intersection from 'lodash/intersection'
import { observer } from 'mobx-react-lite'
import jwtDecode from 'jwt-decode'
import { useQuery } from '@apollo/client'
import { getSnapshot } from 'mobx-state-tree'

// when Karte was loaded async, it did not load,
// but only in production!
import ProjektContainer from './ProjektContainer'
import storeContext from '../../storeContext'
import buildTreeQueryVariables from './buildTreeQueryVariables'
import queryTree from './queryTree'
import buildNodes from './TreeContainer/nodes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  @media print {
    height: auto !important;
    overflow: visible !important;
    display: block;
  }
`
const StyledSplitPane = styled(SplitPane)`
  .Resizer {
    background: #388e3c;
    opacity: 1;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.vertical {
    border-left: 3px solid #388e3c;
    cursor: col-resize;
    background-color: #388e3c;
  }

  .Resizer.vertical:hover {
    border-left: 2px solid rgba(0, 0, 0, 0.3);
    border-right: 2px solid rgba(0, 0, 0, 0.3);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
  .Pane {
    overflow: hidden;
  }
`
const tree2TabValues = ['tree2', 'daten2', 'filter2', 'karte2']

const Projekte = () => {
  const store = useContext(storeContext)
  const { isPrint, urlQuery, setRefetchKey, user, tree } = store
  const { projIdInActiveNodeArray } = tree
  const treeTabValues = [
    'tree',
    'daten',
    'filter',
    'karte',
    ...(projIdInActiveNodeArray ? ['exporte'] : []),
  ]

  const { projekteTabs } = urlQuery
  const treeTabs = useMemo(() => intersection(treeTabValues, projekteTabs), [
    projekteTabs,
    treeTabValues,
  ])
  const tree2Tabs = intersection(tree2TabValues, projekteTabs)

  const treeDataFilter = getSnapshot(store.tree.dataFilter)
  const treeNodeLabelFilter = getSnapshot(store.tree.nodeLabelFilter)
  const treeActiveNodeArray = getSnapshot(store.tree.activeNodeArray)
  const treeOpenNodes = getSnapshot(store.tree.openNodes)
  const treeApFilter = store.tree.apFilter
  const tree2DataFilter = getSnapshot(store.tree2.dataFilter)
  const tree2NodeLabelFilter = getSnapshot(store.tree2.nodeLabelFilter)
  const tree2ActiveNodeArray = getSnapshot(store.tree2.activeNodeArray)
  const tree2OpenNodes = getSnapshot(store.tree2.openNodes)
  const tree2ApFilter = store.tree2.apFilter

  const queryTreeVariables = useMemo(
    () =>
      buildTreeQueryVariables({
        treeName: 'tree',
        dataFilter: treeDataFilter,
        openNodes: treeOpenNodes,
        activeNodeArray: treeActiveNodeArray,
        apFilter: treeApFilter,
        nodeLabelFilter: treeNodeLabelFilter,
      }),
    [
      treeDataFilter,
      treeActiveNodeArray,
      treeApFilter,
      treeNodeLabelFilter,
      treeOpenNodes,
    ],
  )
  const queryTree2Variables = useMemo(
    () =>
      buildTreeQueryVariables({
        treeName: 'tree2',
        dataFilter: tree2DataFilter,
        openNodes: tree2OpenNodes,
        activeNodeArray: tree2ActiveNodeArray,
        apFilter: tree2ApFilter,
        nodeLabelFilter: tree2NodeLabelFilter,
      }),
    [
      tree2DataFilter,
      tree2ActiveNodeArray,
      tree2ApFilter,
      tree2NodeLabelFilter,
      tree2OpenNodes,
    ],
  )

  const {
    data: treeData,
    error: treeError,
    loading: treeLoading,
    refetch: treeRefetch,
  } = useQuery(queryTree, {
    variables: queryTreeVariables,
  })
  // TODO: make this tree dependant
  setRefetchKey({
    key: 'tree',
    value: treeRefetch,
  })
  const {
    data: tree2Data,
    error: tree2Error,
    loading: tree2Loading,
    refetch: tree2Refetch,
  } = useQuery(queryTree, {
    variables: queryTree2Variables,
  })

  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const [treeNodes, setTreeNodes] = useState([])
  const [tree2Nodes, setTree2Nodes] = useState([])

  useEffect(() => {
    //console.log('Projekte, building treeNodes')
    if (!treeLoading) {
      setTreeNodes(
        buildNodes({
          treeName: 'tree',
          role,
          data: treeData,
          loading: treeLoading,
          store,
          dataFilter: treeDataFilter,
        }),
      )
    }
  }, [
    treeLoading,
    //activeNodeArray,
    store.tree.openNodes,
    store.tree.openNodes.length,
    treeData,
    treeDataFilter,
    role,
    store,
  ])
  useEffect(() => {
    if (!(tree2Tabs.length === 0 || isPrint)) {
      //console.log('Projekte, building tree2Nodes')
      if (!tree2Loading) {
        setTree2Nodes(
          buildNodes({
            treeName: 'tree2',
            role,
            dataFilter: tree2DataFilter,
            data: tree2Data,
            loading: tree2Loading,
            store,
          }),
        )
      }
    }
  }, [
    tree2Loading,
    //activeNodeArray,
    store.tree2.openNodes,
    store.tree2.openNodes.length,
    tree2Data,
    tree2DataFilter,
    role,
    store,
    tree2Tabs.length,
    isPrint,
    treeLoading,
  ])

  if (tree2Tabs.length === 0 || isPrint) {
    return (
      <Container>
        <ProjektContainer
          treeName="tree"
          tabs={treeTabs}
          projekteTabs={projekteTabs}
          nodes={treeNodes}
          treeLoading={treeLoading}
          treeRefetch={treeRefetch}
          treeError={treeError}
        />
      </Container>
    )
  }

  return (
    <Container>
      <StyledSplitPane split="vertical" defaultSize="50%">
        <ProjektContainer
          treeName="tree"
          tabs={treeTabs}
          projekteTabs={projekteTabs}
          nodes={treeNodes}
          treeLoading={treeLoading}
          treeRefetch={treeRefetch}
          treeError={treeError}
        />
        <ProjektContainer
          treeName="tree2"
          tabs={tree2Tabs}
          projekteTabs={projekteTabs}
          nodes={tree2Nodes}
          treeLoading={tree2Loading}
          treeRefetch={tree2Refetch}
          treeError={tree2Error}
        />
      </StyledSplitPane>
    </Container>
  )
}

export default observer(Projekte)
