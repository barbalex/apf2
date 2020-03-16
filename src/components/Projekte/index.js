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
import { useQuery } from '@apollo/react-hooks'

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
const treeTabValues = ['tree', 'daten', 'filter', 'karte', 'exporte']
const tree2TabValues = ['tree2', 'daten2', 'filter2', 'karte2', 'exporte2']

const Projekte = () => {
  const store = useContext(storeContext)
  const { isPrint, urlQuery, setRefetchKey, user, nodeFilter } = store

  const { projekteTabs } = urlQuery
  const treeTabs = intersection(treeTabValues, projekteTabs)
  const tree2Tabs = intersection(tree2TabValues, projekteTabs)

  const queryTreeVariables = useMemo(() => {
    const {
      projekt,
      isProjekt,
      apFilter,
      ap,
      isAp,
      ziel,
      isZiel,
      pop,
      isPop,
      popFilter,
      tpop,
      isTpop,
      tpopFilter,
      tpopkontr,
      isTpopkontr,
      isWerteListen,
      tpopmassnFilter,
      tpopfeldkontrFilter,
      tpopfreiwkontrFilter,
    } = buildTreeQueryVariables({ treeName: 'tree', store })
    const { nodeLabelFilter } = store.tree

    const apsFilter = { ...apFilter }
    if (nodeLabelFilter.ap) {
      apsFilter.label = { includesInsensitive: nodeLabelFilter.ap }
    }
    const apberuebersichtsFilter = { projId: { in: projekt } }
    if (!!nodeLabelFilter.apberuebersicht) {
      apberuebersichtsFilter.label = {
        includesInsensitive: nodeLabelFilter.apberuebersicht,
      }
    }
    const apbersFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.apber) {
      apbersFilter.label = { includesInsensitive: nodeLabelFilter.apber }
    }
    const apartsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.apart) {
      apartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
    }
    const assozartFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.assozart) {
      assozartFilter.label = {
        includesInsensitive: nodeLabelFilter.assozart,
      }
    }
    const beobNichtBeurteiltsFilter = {
      nichtZuordnen: { equalTo: false },
      apId: { in: ap },
      tpopId: { isNull: true },
    }
    if (!!nodeLabelFilter.beob) {
      beobNichtBeurteiltsFilter.label = {
        includesInsensitive: nodeLabelFilter.beob,
      }
    }
    const beobNichtZuzuordnensFilter = {
      nichtZuordnen: { equalTo: true },
      apId: { in: ap },
    }
    if (!!nodeLabelFilter.beob) {
      beobNichtZuzuordnensFilter.label = {
        includesInsensitive: nodeLabelFilter.beob,
      }
    }
    const beobZugeordnetsFilter = { tpopId: { in: tpop } }
    if (!!nodeLabelFilter.beob) {
      beobZugeordnetsFilter.label = {
        includesInsensitive: nodeLabelFilter.beob,
      }
    }
    const bersFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ber) {
      bersFilter.label = {
        includesInsensitive: nodeLabelFilter.ber,
      }
    }
    const ekfrequenzsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ekfrequenz) {
      ekfrequenzsFilter.label = {
        includesInsensitive: nodeLabelFilter.ekfrequenz,
      }
    }
    const ekzaehleinheitsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ekzaehleinheit) {
      ekzaehleinheitsFilter.label = {
        includesInsensitive: nodeLabelFilter.ekzaehleinheit,
      }
    }
    const erfkritsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.erfkrit) {
      erfkritsFilter.label = {
        includesInsensitive: nodeLabelFilter.erfkrit,
      }
    }
    const popbersFilter = { popId: { in: pop } }
    if (!!nodeLabelFilter.popber) {
      popbersFilter.label = {
        includesInsensitive: nodeLabelFilter.popber,
      }
    }
    const popmassnbersFilter = { popId: { in: pop } }
    if (!!nodeLabelFilter.popmassnber) {
      popmassnbersFilter.label = {
        includesInsensitive: nodeLabelFilter.popmassnber,
      }
    }
    const popsFilter = { ...popFilter }
    if (!!nodeLabelFilter.pop) {
      popsFilter.label = {
        includesInsensitive: nodeLabelFilter.pop,
      }
    }
    const tpopbersFilter = { tpopId: { in: tpop } }
    if (!!nodeLabelFilter.tpopber) {
      tpopbersFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopber,
      }
    }
    const tpopfeldkontrsFilter = { ...tpopfeldkontrFilter }
    if (!!nodeLabelFilter.tpopkontr) {
      tpopfeldkontrsFilter.labelEk = {
        includesInsensitive: nodeLabelFilter.tpopkontr,
      }
    }
    const tpopfreiwkontrsFilter = { ...tpopfreiwkontrFilter }
    if (!!nodeLabelFilter.tpopkontr) {
      tpopfreiwkontrsFilter.labelEkf = {
        includesInsensitive: nodeLabelFilter.tpopkontr,
      }
    }
    const tpopkontrzaehlsFilter = { tpopkontrId: { in: tpopkontr } }
    if (!!nodeLabelFilter.tpopkontrzaehl) {
      tpopkontrzaehlsFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
      }
    }
    const tpopmassnbersFilter = { tpopId: { in: tpop } }
    if (!!nodeLabelFilter.tpopmassnber) {
      tpopmassnbersFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopmassnber,
      }
    }
    const tpopmassnsFilter = { ...tpopmassnFilter }
    if (!!nodeLabelFilter.tpopmassn) {
      tpopmassnsFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopmassn,
      }
    }
    const tpopsFilter = { ...tpopFilter }
    if (!!nodeLabelFilter.tpop) {
      tpopsFilter.label = {
        includesInsensitive: nodeLabelFilter.tpop,
      }
    }
    const usersFilter = { id: { isNull: false } }
    if (!!nodeLabelFilter.user) {
      usersFilter.label = {
        includesInsensitive: nodeLabelFilter.user,
      }
    }
    const adressesFilter = nodeLabelFilter.adresse
      ? { label: { includesInsensitive: nodeLabelFilter.adresse } }
      : { id: { isNull: false } }
    const apberrelevantGrundWertesFilter = nodeLabelFilter.apberrelevantGrundWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.apberrelevantGrundWerte,
          },
        }
      : { id: { isNull: false } }
    const tpopkontrzaehlEinheitWertesFilter = nodeLabelFilter.tpopkontrzaehlEinheitWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.tpopkontrzaehlEinheitWerte,
          },
        }
      : { id: { isNull: false } }
    const ekAbrechnungstypWertesFilter = nodeLabelFilter.ekAbrechnungstypWerte
      ? {
          label: { includesInsensitive: nodeLabelFilter.ekAbrechnungstypWerte },
        }
      : { id: { isNull: false } }
    const zielbersFilter = { zielId: { in: ziel } }
    if (!!nodeLabelFilter.zielber) {
      zielbersFilter.label = {
        includesInsensitive: nodeLabelFilter.zielber,
      }
    }
    const zielsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ziel) {
      zielsFilter.label = {
        includesInsensitive: nodeLabelFilter.ziel,
      }
    }
    return {
      isProjekt,
      isAp,
      isPop,
      isTpop,
      isTpopkontr,
      isWerteListen,
      isZiel,
      apartsFilter,
      apbersFilter,
      apberuebersichtsFilter,
      apsFilter,
      assozartFilter,
      beobNichtBeurteiltsFilter,
      beobNichtZuzuordnensFilter,
      beobZugeordnetsFilter,
      bersFilter,
      ekfrequenzsFilter,
      ekzaehleinheitsFilter,
      erfkritsFilter,
      popbersFilter,
      popmassnbersFilter,
      popsFilter,
      tpopbersFilter,
      tpopfeldkontrsFilter,
      tpopfreiwkontrsFilter,
      tpopkontrzaehlsFilter,
      tpopmassnbersFilter,
      tpopmassnsFilter,
      tpopsFilter,
      usersFilter,
      adressesFilter,
      apberrelevantGrundWertesFilter,
      tpopkontrzaehlEinheitWertesFilter,
      ekAbrechnungstypWertesFilter,
      zielbersFilter,
      zielsFilter,
    }
  }, [store])
  const queryTree2Variables = useMemo(() => {
    const {
      projekt,
      isProjekt,
      apFilter,
      ap,
      isAp,
      ziel,
      isZiel,
      pop,
      isPop,
      popFilter,
      tpop,
      isTpop,
      tpopFilter,
      tpopkontr,
      isTpopkontr,
      isWerteListen,
      tpopmassnFilter,
      tpopfeldkontrFilter,
      tpopfreiwkontrFilter,
    } = buildTreeQueryVariables({ treeName: 'tree2', store })
    const { nodeLabelFilter } = store.tree2
    const apsFilter = { ...apFilter }
    if (nodeLabelFilter.ap) {
      apsFilter.label = { includesInsensitive: nodeLabelFilter.ap }
    }
    const apberuebersichtsFilter = { projId: { in: projekt } }
    if (!!nodeLabelFilter.apberuebersicht) {
      apberuebersichtsFilter.label = {
        includesInsensitive: nodeLabelFilter.apberuebersicht,
      }
    }
    const apbersFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.apber) {
      apbersFilter.label = { includesInsensitive: nodeLabelFilter.apber }
    }
    const apartsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.apart) {
      apartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
    }
    const assozartFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.assozart) {
      assozartFilter.label = {
        includesInsensitive: nodeLabelFilter.assozart,
      }
    }
    const beobNichtBeurteiltsFilter = {
      nichtZuordnen: { equalTo: false },
      apId: { in: ap },
      tpopId: { isNull: true },
    }
    if (!!nodeLabelFilter.beob) {
      beobNichtBeurteiltsFilter.label = {
        includesInsensitive: nodeLabelFilter.beob,
      }
    }
    const beobNichtZuzuordnensFilter = {
      nichtZuordnen: { equalTo: true },
      apId: { in: ap },
    }
    if (!!nodeLabelFilter.beob) {
      beobNichtZuzuordnensFilter.label = {
        includesInsensitive: nodeLabelFilter.beob,
      }
    }
    const beobZugeordnetsFilter = { tpopId: { in: tpop } }
    if (!!nodeLabelFilter.beob) {
      beobZugeordnetsFilter.label = {
        includesInsensitive: nodeLabelFilter.beob,
      }
    }
    const bersFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ber) {
      bersFilter.label = {
        includesInsensitive: nodeLabelFilter.ber,
      }
    }
    const ekfrequenzsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ekfrequenz) {
      ekfrequenzsFilter.label = {
        includesInsensitive: nodeLabelFilter.ekfrequenz,
      }
    }
    const ekzaehleinheitsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ekzaehleinheit) {
      ekzaehleinheitsFilter.label = {
        includesInsensitive: nodeLabelFilter.ekzaehleinheit,
      }
    }
    const erfkritsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.erfkrit) {
      erfkritsFilter.label = {
        includesInsensitive: nodeLabelFilter.erfkrit,
      }
    }
    const popbersFilter = { popId: { in: pop } }
    if (!!nodeLabelFilter.popber) {
      popbersFilter.label = {
        includesInsensitive: nodeLabelFilter.popber,
      }
    }
    const popmassnbersFilter = { popId: { in: pop } }
    if (!!nodeLabelFilter.popmassnber) {
      popmassnbersFilter.label = {
        includesInsensitive: nodeLabelFilter.popmassnber,
      }
    }
    const popsFilter = { ...popFilter }
    if (!!nodeLabelFilter.pop) {
      popsFilter.label = {
        includesInsensitive: nodeLabelFilter.pop,
      }
    }
    const tpopbersFilter = { tpopId: { in: tpop } }
    if (!!nodeLabelFilter.tpopber) {
      tpopbersFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopber,
      }
    }
    const tpopfeldkontrsFilter = { ...tpopfeldkontrFilter }
    if (!!nodeLabelFilter.tpopkontr) {
      tpopfeldkontrsFilter.labelEk = {
        includesInsensitive: nodeLabelFilter.tpopkontr,
      }
    }
    const tpopfreiwkontrsFilter = { ...tpopfreiwkontrFilter }
    if (!!nodeLabelFilter.tpopkontr) {
      tpopfreiwkontrsFilter.labelEkf = {
        includesInsensitive: nodeLabelFilter.tpopkontr,
      }
    }
    const tpopkontrzaehlsFilter = { tpopkontrId: { in: tpopkontr } }
    if (!!nodeLabelFilter.tpopkontrzaehl) {
      tpopkontrzaehlsFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
      }
    }
    const tpopmassnbersFilter = { tpopId: { in: tpop } }
    if (!!nodeLabelFilter.tpopmassnber) {
      tpopmassnbersFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopmassnber,
      }
    }
    const tpopmassnsFilter = { ...tpopmassnFilter }
    if (!!nodeLabelFilter.tpopmassn) {
      tpopmassnsFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopmassn,
      }
    }
    const tpopsFilter = { ...tpopFilter }
    if (!!nodeLabelFilter.tpop) {
      tpopsFilter.label = {
        includesInsensitive: nodeLabelFilter.tpop,
      }
    }
    const usersFilter = { id: { isNull: false } }
    if (!!nodeLabelFilter.user) {
      usersFilter.label = {
        includesInsensitive: nodeLabelFilter.user,
      }
    }
    const adressesFilter = nodeLabelFilter.adresse
      ? { label: { includesInsensitive: nodeLabelFilter.adresse } }
      : { id: { isNull: false } }
    const apberrelevantGrundWertesFilter = nodeLabelFilter.apberrelevantGrundWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.apberrelevantGrundWerte,
          },
        }
      : { id: { isNull: false } }
    const tpopkontrzaehlEinheitWertesFilter = nodeLabelFilter.tpopkontrzaehlEinheitWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.tpopkontrzaehlEinheitWerte,
          },
        }
      : { id: { isNull: false } }
    const ekAbrechnungstypWertesFilter = nodeLabelFilter.ekAbrechnungstypWerte
      ? {
          label: { includesInsensitive: nodeLabelFilter.ekAbrechnungstypWerte },
        }
      : { id: { isNull: false } }
    const zielbersFilter = { zielId: { in: ziel } }
    if (!!nodeLabelFilter.zielber) {
      zielbersFilter.label = {
        includesInsensitive: nodeLabelFilter.zielber,
      }
    }
    const zielsFilter = { apId: { in: ap } }
    if (!!nodeLabelFilter.ziel) {
      zielsFilter.label = {
        includesInsensitive: nodeLabelFilter.ziel,
      }
    }
    return {
      isProjekt,
      isAp,
      isPop,
      isTpop,
      isTpopkontr,
      isWerteListen,
      isZiel,
      apartsFilter,
      apbersFilter,
      apberuebersichtsFilter,
      apsFilter,
      assozartFilter,
      beobNichtBeurteiltsFilter,
      beobNichtZuzuordnensFilter,
      beobZugeordnetsFilter,
      bersFilter,
      ekfrequenzsFilter,
      ekzaehleinheitsFilter,
      erfkritsFilter,
      popbersFilter,
      popmassnbersFilter,
      popsFilter,
      tpopbersFilter,
      tpopfeldkontrsFilter,
      tpopfreiwkontrsFilter,
      tpopkontrzaehlsFilter,
      tpopmassnbersFilter,
      tpopmassnsFilter,
      tpopsFilter,
      usersFilter,
      adressesFilter,
      apberrelevantGrundWertesFilter,
      tpopkontrzaehlEinheitWertesFilter,
      ekAbrechnungstypWertesFilter,
      zielbersFilter,
      zielsFilter,
    }
  }, [store])

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

  // TODO: make nodeFilter tree dependant
  useEffect(() => {
    //console.log('Projekte, building treeNodes')
    setTreeNodes(
      buildNodes({
        treeName: 'tree',
        role,
        nodeFilter,
        data: treeData,
        loading: treeLoading,
        store,
      }),
    )
  }, [
    treeLoading,
    //activeNodeArray,
    store.tree.openNodes,
    store.tree.openNodes.length,
    treeData,
    nodeFilter,
    role,
    store,
  ])
  useEffect(() => {
    if (!(tree2Tabs.length === 0 || isPrint)) {
      //console.log('Projekte, building tree2Nodes')
      setTree2Nodes(
        buildNodes({
          treeName: 'tree2',
          role,
          nodeFilter,
          data: tree2Data,
          loading: tree2Loading,
          store,
        }),
      )
    }
  }, [
    tree2Loading,
    //activeNodeArray,
    store.tree2.openNodes,
    store.tree2.openNodes.length,
    tree2Data,
    nodeFilter,
    role,
    store,
    tree2Tabs.length,
    isPrint,
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
