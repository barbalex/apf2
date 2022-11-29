/**
 * 2020.03.16:
 * used to build nodes in TreeContainer
 * but need to pass them to Daten
 * and react would not like this to happen from below
 * so needed to move building nodes up to here
 */
import React, { useContext, useMemo, useState, useEffect } from 'react'
import styled from '@emotion/styled'
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
  height: 100%;
  position: relative;

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
  const { isPrint, urlQuery, user, tree } = store
  const { projIdInActiveNodeArray, apIdInActiveNodeArray } = tree
  // react hooks 'exhaustive-deps' rule wants to move treeTabValues into own useMemo
  // to prevent it from causing unnessecary renders
  // BUT: this prevents necessary renders: clicking tabs does not cause re-render!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const treeTabValues = [
    'tree',
    'daten',
    'filter',
    'karte',
    ...(projIdInActiveNodeArray ? ['exporte'] : []),
  ]

  const { projekteTabs } = urlQuery
  const treeTabs = useMemo(
    () => intersection(treeTabValues, projekteTabs),
    [projekteTabs, treeTabValues],
  )
  const tree2Tabs = intersection(tree2TabValues, projekteTabs)

  const treeDataFilter = getSnapshot(store.tree.dataFilter)
  const treeNodeLabelFilter = getSnapshot(store.tree.nodeLabelFilter)
  const treeOpenNodes = getSnapshot(store.tree.openNodes)
  const treeApFilter = store.tree.apFilter
  const tree2DataFilter = getSnapshot(store.tree2.dataFilter)
  const tree2NodeLabelFilter = getSnapshot(store.tree2.nodeLabelFilter)
  const tree2OpenNodes = getSnapshot(store.tree2.openNodes)
  const tree2ApFilter = store.tree2.apFilter
  const popGqlFilterTree = store.tree.popGqlFilter
  const popGqlFilterTree2 = store.tree2.popGqlFilter
  const apGqlFilterTree = store.tree.apGqlFilter
  const apGqlFilterTree2 = store.tree2.apGqlFilter
  const tpopGqlFilterTree = store.tree.tpopGqlFilter
  const tpopGqlFilterTree2 = store.tree2.tpopGqlFilter
  const tpopmassnGqlFilterTree = store.tree.tpopmassnGqlFilter
  const tpopmassnGqlFilterTree2 = store.tree2.tpopmassnGqlFilter
  const ekGqlFilterTree = store.tree.ekGqlFilter
  const ekGqlFilterTree2 = store.tree2.ekGqlFilter
  const ekfGqlFilterTree = store.tree.ekfGqlFilter
  const ekfGqlFilterTree2 = store.tree2.ekfGqlFilter
  const beobGqlFilterTree = store.tree.beobGqlFilter
  const beobGqlFilterTree2 = store.tree2.beobGqlFilter

  const queryTreeVariables = useMemo(
    () =>
      buildTreeQueryVariables({
        dataFilter: treeDataFilter,
        openNodes: treeOpenNodes,
        apFilter: treeApFilter,
        nodeLabelFilter: treeNodeLabelFilter,
        apIdInActiveNodeArray,
        popGqlFilter: popGqlFilterTree,
        tpopGqlFilter: tpopGqlFilterTree,
        tpopmassnGqlFilter: tpopmassnGqlFilterTree,
        ekGqlFilter: ekGqlFilterTree,
        ekfGqlFilter: ekfGqlFilterTree,
        apGqlFilter: apGqlFilterTree,
        beobGqlFilter: beobGqlFilterTree,
      }),
    [
      treeDataFilter,
      treeOpenNodes,
      treeApFilter,
      treeNodeLabelFilter,
      apIdInActiveNodeArray,
      popGqlFilterTree,
      tpopGqlFilterTree,
      tpopmassnGqlFilterTree,
      ekGqlFilterTree,
      ekfGqlFilterTree,
      apGqlFilterTree,
      beobGqlFilterTree,
    ],
  )
  const queryTree2Variables = useMemo(
    () =>
      buildTreeQueryVariables({
        dataFilter: tree2DataFilter,
        openNodes: tree2OpenNodes,
        apFilter: tree2ApFilter,
        nodeLabelFilter: tree2NodeLabelFilter,
        apIdInActiveNodeArray,
        popGqlFilter: popGqlFilterTree2,
        tpopGqlFilter: tpopGqlFilterTree2,
        tpopmassnGqlFilter: tpopmassnGqlFilterTree2,
        ekGqlFilter: ekGqlFilterTree2,
        ekfGqlFilter: ekfGqlFilterTree2,
        apGqlFilter: apGqlFilterTree2,
        beobGqlFilter: beobGqlFilterTree2,
      }),
    [
      tree2DataFilter,
      tree2OpenNodes,
      tree2ApFilter,
      tree2NodeLabelFilter,
      apIdInActiveNodeArray,
      popGqlFilterTree2,
      tpopGqlFilterTree2,
      tpopmassnGqlFilterTree2,
      ekGqlFilterTree2,
      ekfGqlFilterTree2,
      apGqlFilterTree2,
      beobGqlFilterTree2,
    ],
  )

  const {
    data: treeData,
    error: treeError,
    loading: treeLoading,
  } = useQuery(queryTree, {
    variables: queryTreeVariables,
  })
  const {
    data: tree2Data,
    error: tree2Error,
    loading: tree2Loading,
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

  // prevent scrolling/mousewheel from changing numbers
  // while not preventing scrolling itself!
  // https://stackoverflow.com/a/20838527/712005
  // passive: false is needed or else chrome will bark
  useEffect(() => {
    const handleWheel = (e) => {
      //console.log('preventing wheel')
      e.preventDefault()
      e.target.blur()
    }
    const handleFocusNumberInput = (e) => {
      //console.log('handleFocusNumberInput, e is:', e)
      if (e.target.type === 'number') {
        e.target.addEventListener('wheel', handleWheel, { passive: false })
      }
    }
    document.addEventListener('focusin', handleFocusNumberInput, {
      passive: false,
    })

    const handleBlurNumberInput = (e) => {
      //console.log('handleBlurNumberInput, e is:', e)
      if (e.target.type === 'number') {
        e.target.removeEventListener('wheel', handleWheel, { passive: false })
      }
    }
    document.addEventListener('focusout', handleBlurNumberInput, {
      passive: false,
    })

    return () => {
      document.removeEventListener('focusout', handleBlurNumberInput, {
        passive: false,
      })
    }
  }, [])

  // console.log('Projekte rendering')

  if (tree2Tabs.length === 0 || isPrint) {
    return (
      <Container>
        <ProjektContainer
          treeName="tree"
          tabs={treeTabs}
          nodes={treeNodes}
          treeLoading={treeLoading}
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
          nodes={treeNodes}
          treeLoading={treeLoading}
          treeError={treeError}
        />
        <ProjektContainer
          treeName="tree2"
          tabs={tree2Tabs}
          nodes={tree2Nodes}
          treeLoading={tree2Loading}
          treeError={tree2Error}
        />
      </StyledSplitPane>
    </Container>
  )
}

export default observer(Projekte)
