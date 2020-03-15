import React, { useContext, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import jwtDecode from 'jwt-decode'

import Row from './Row'

import storeContext from '../../../../storeContext'
import buildVariables from './buildVariables'
import queryUsers from './queryUsers'
import queryTpops from './queryTpops'
import queryTpopmassns from './queryTpopmassns'
import queryTpopmassnbers from './queryTpopmassnbers'
import queryTpopfreiwkontrs from './queryTpopfreiwkontrs'
import queryTpopkontrzaehls from './queryTpopkontrzaehls'
import queryZiels from './queryZiels'
import queryZielbers from './queryZielbers'
import queryAll from './queryAll'
import queryWerte from './queryWerte'
import buildNodes from '../nodes'
import logout from '../../../../modules/logout'
import existsPermissionError from '../../../../modules/existsPermissionError'
import anyQueryIsLoading from '../../../../modules/anyQueryIsLoading'
import anyQueryReturnsError from '../../../../modules/anyQueryReturnsError'
import idbContext from '../../../../idbContext'

const singleRowHeight = 23
const Container = styled.div`
  height: 100%;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`
const StyledList = styled(List)`
  overflow-x: hidden !important;
`
const ErrorContainer = styled.div`
  padding: 15px;
`
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`

const Tree = ({ treeName }) => {
  const store = useContext(storeContext)
  const tree = store[treeName]
  const {
    activeNodeArray,
    setActiveNodeArray,
    openNodes,
    setOpenNodes,
    nodeLabelFilter,
    treeWidth,
    treeHeight,
  } = tree
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { nodeFilter, user, setRefetchKey } = store
  const { idb } = useContext(idbContext)
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
  } = buildVariables({ treeName, store })

  const queryUsersFilter = { id: { isNull: false } }
  if (!!nodeLabelFilter.user) {
    queryUsersFilter.label = {
      includesInsensitive: nodeLabelFilter.user,
    }
  }
  const {
    data: dataUsers,
    error: errorUsers,
    loading: loadingUsers,
    refetch: refetchUsers,
  } = useQuery(queryUsers, {
    variables: {
      filter: queryUsersFilter,
    },
  })
  setRefetchKey({
    key: 'users',
    value: refetchUsers,
  })
  const queryTpopsFilter = { ...tpopFilter }
  if (!!nodeLabelFilter.tpop) {
    queryTpopsFilter.label = {
      includesInsensitive: nodeLabelFilter.tpop,
    }
  }
  const {
    data: dataTpops,
    error: errorTpops,
    loading: loadingTpops,
    refetch: refetchTpops,
  } = useQuery(queryTpops, {
    variables: { isPop, filter: queryTpopsFilter },
  })
  setRefetchKey({
    key: 'tpops',
    value: refetchTpops,
  })
  const queryTpopmassnsFilter = { ...tpopmassnFilter }
  if (!!nodeLabelFilter.tpopmassn) {
    queryTpopmassnsFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassn,
    }
  }
  const {
    data: dataTpopmassns,
    error: errorTpopmassns,
    loading: loadingTpopmassns,
    refetch: refetchTpopmassns,
  } = useQuery(queryTpopmassns, {
    variables: { isTpop, filter: queryTpopmassnsFilter },
  })
  setRefetchKey({
    key: 'tpopmassns',
    value: refetchTpopmassns,
  })
  const queryTpopmassnbersFilter = { tpopId: { in: tpop } }
  if (!!nodeLabelFilter.tpopmassnber) {
    queryTpopmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassnber,
    }
  }
  const {
    data: dataTpopmassnbers,
    error: errorTpopmassnbers,
    loading: loadingTpopmassnbers,
    refetch: refetchTpopmassnbers,
  } = useQuery(queryTpopmassnbers, {
    variables: { isTpop, filter: queryTpopmassnbersFilter },
  })
  setRefetchKey({
    key: 'tpopmassnbers',
    value: refetchTpopmassnbers,
  })
  const queryTpopfreiwkontrsFilter = { ...tpopfreiwkontrFilter }
  if (!!nodeLabelFilter.tpopkontr) {
    queryTpopfreiwkontrsFilter.labelEkf = {
      includesInsensitive: nodeLabelFilter.tpopkontr,
    }
  }
  const {
    data: dataTpopfreiwkontrs,
    error: errorTpopfreiwkontrs,
    loading: loadingTpopfreiwkontrs,
    refetch: refetchTpopfreiwkontrs,
  } = useQuery(queryTpopfreiwkontrs, {
    variables: { isTpop, filter: queryTpopfreiwkontrsFilter },
  })
  setRefetchKey({
    key: 'tpopfreiwkontrs',
    value: refetchTpopfreiwkontrs,
  })
  const queryTpopkontrzaehlsFilter = { tpopkontrId: { in: tpopkontr } }
  if (!!nodeLabelFilter.tpopkontrzaehl) {
    queryTpopkontrzaehlsFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
    }
  }
  const {
    data: dataTpopkontrzaehls,
    error: errorTpopkontrzaehls,
    loading: loadingTpopkontrzaehls,
    refetch: refetchTpopkontrzaehls,
  } = useQuery(queryTpopkontrzaehls, {
    variables: { isTpopkontr, filter: queryTpopkontrzaehlsFilter },
  })
  setRefetchKey({
    key: 'tpopkontrzaehls',
    value: refetchTpopkontrzaehls,
  })
  const queryZielsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.ziel) {
    queryZielsFilter.label = {
      includesInsensitive: nodeLabelFilter.ziel,
    }
  }
  const {
    data: dataZiels,
    error: errorZiels,
    loading: loadingZiels,
    refetch: refetchZiels,
  } = useQuery(queryZiels, {
    variables: { isAp, filter: queryZielsFilter },
  })
  setRefetchKey({
    key: 'ziels',
    value: refetchZiels,
  })
  const queryZielbersFilter = { zielId: { in: ziel } }
  if (!!nodeLabelFilter.zielber) {
    queryZielbersFilter.label = {
      includesInsensitive: nodeLabelFilter.zielber,
    }
  }
  const {
    data: dataZielbers,
    error: errorZielbers,
    loading: loadingZielbers,
    refetch: refetchZielbers,
  } = useQuery(queryZielbers, {
    variables: { isZiel, filter: queryZielbersFilter },
  })
  setRefetchKey({
    key: 'zielbers',
    value: refetchZielbers,
  })

  const queryApsFilter = { ...apFilter }
  if (nodeLabelFilter.ap) {
    queryApsFilter.label = { includesInsensitive: nodeLabelFilter.ap }
  }
  const queryApberuebersichtsFilter = { projId: { in: projekt } }
  if (!!nodeLabelFilter.apberuebersicht) {
    queryApberuebersichtsFilter.label = {
      includesInsensitive: nodeLabelFilter.apberuebersicht,
    }
  }
  const queryApbersFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.apber) {
    queryApbersFilter.label = { includesInsensitive: nodeLabelFilter.apber }
  }
  const queryApartsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.apart) {
    queryApartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
  }
  const queryAssozartsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.assozart) {
    queryAssozartsFilter.label = {
      includesInsensitive: nodeLabelFilter.assozart,
    }
  }
  const queryBeobNichtBeurteiltsFilter = {
    nichtZuordnen: { equalTo: false },
    apId: { in: ap },
    tpopId: { isNull: true },
  }
  if (!!nodeLabelFilter.beob) {
    queryBeobNichtBeurteiltsFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const queryBeobNichtZuzuordnensFilter = {
    nichtZuordnen: { equalTo: true },
    apId: { in: ap },
  }
  if (!!nodeLabelFilter.beob) {
    queryBeobNichtZuzuordnensFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const queryBeobZugeordnetsFilter = { tpopId: { in: tpop } }
  if (!!nodeLabelFilter.beob) {
    queryBeobZugeordnetsFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const queryBersFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.ber) {
    queryBersFilter.label = {
      includesInsensitive: nodeLabelFilter.ber,
    }
  }
  const queryEkfrequenzsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.ekfrequenz) {
    queryEkfrequenzsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekfrequenz,
    }
  }
  const queryEkzaehleinheitsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.ekzaehleinheit) {
    queryEkzaehleinheitsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekzaehleinheit,
    }
  }
  const queryErfkritsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.erfkrit) {
    queryErfkritsFilter.label = {
      includesInsensitive: nodeLabelFilter.erfkrit,
    }
  }
  const queryPopbersFilter = { popId: { in: pop } }
  if (!!nodeLabelFilter.popber) {
    queryPopbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popber,
    }
  }
  const queryPopmassnbersFilter = { popId: { in: pop } }
  if (!!nodeLabelFilter.popmassnber) {
    queryPopmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }
  const queryPopsFilter = { ...popFilter }
  if (!!nodeLabelFilter.pop) {
    queryPopsFilter.label = {
      includesInsensitive: nodeLabelFilter.pop,
    }
  }
  const queryTpopbersFilter = { tpopId: { in: tpop } }
  if (!!nodeLabelFilter.tpopber) {
    queryTpopbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }
  const queryTpopfeldkontrsFilter = { ...tpopfeldkontrFilter }
  if (!!nodeLabelFilter.tpopkontr) {
    queryTpopfeldkontrsFilter.labelEk = {
      includesInsensitive: nodeLabelFilter.tpopkontr,
    }
  }
  const {
    data: dataAll,
    error: errorAll,
    loading: loadingAll,
    refetch: refetchAll,
  } = useQuery(queryAll, {
    variables: {
      isProjekt,
      isAp,
      isPop,
      isTpop,
      apartsFilter: queryApartsFilter,
      apbersFilter: queryApbersFilter,
      apberuebersichtsFilter: queryApberuebersichtsFilter,
      apsFilter: queryApsFilter,
      assozartFilter: queryAssozartsFilter,
      beobNichtBeurteiltsFilter: queryBeobNichtBeurteiltsFilter,
      beobNichtZuzuordnensFilter: queryBeobNichtZuzuordnensFilter,
      beobZugeordnetsFilter: queryBeobZugeordnetsFilter,
      bersFilter: queryBersFilter,
      ekfrequenzsFilter: queryEkfrequenzsFilter,
      ekzaehleinheitsFilter: queryEkzaehleinheitsFilter,
      erfkritsFilter: queryErfkritsFilter,
      popbersFilter: queryPopbersFilter,
      popmassnbersFilter: queryPopmassnbersFilter,
      popsFilter: queryPopsFilter,
      tpopbersFilter: queryTpopbersFilter,
      tpopfeldkontrsFilter: queryTpopfeldkontrsFilter,
    },
  })
  setRefetchKey({
    key: 'all',
    value: refetchAll,
  })

  const adressesFilter = nodeLabelFilter.adresse
    ? { label: { includesInsensitive: nodeLabelFilter.adresse } }
    : { id: { isNull: false } }
  const apberrelevantGrundWertesFilter = nodeLabelFilter.apberrelevantGrundWerte
    ? {
        label: { includesInsensitive: nodeLabelFilter.apberrelevantGrundWerte },
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
  const {
    data: dataWertes,
    error: errorWertes,
    loading: loadingWertes,
    refetch: refetchWertes,
  } = useQuery(queryWerte, {
    variables: {
      isWerteListen,
      adressesFilter,
      apberrelevantGrundWertesFilter,
      tpopkontrzaehlEinheitWertesFilter,
      ekAbrechnungstypWertesFilter,
    },
  })
  setRefetchKey({
    key: 'adresses',
    value: refetchWertes,
  })
  setRefetchKey({
    key: 'tpopApberrelevantGrundWertes',
    value: refetchWertes,
  })
  setRefetchKey({
    key: 'tpopkontrzaehlEinheitWertes',
    value: refetchWertes,
  })
  setRefetchKey({
    key: 'ekAbrechnungstypWertes',
    value: refetchWertes,
  })

  const queryLoadingArray = [
    loadingWertes,
    loadingUsers,
    loadingTpops,
    loadingTpopmassns,
    loadingTpopmassnbers,
    loadingTpopfreiwkontrs,
    loadingTpopkontrzaehls,
    loadingZiels,
    loadingZielbers,
    loadingAll,
  ]

  const queryErrorArray = [
    errorWertes,
    errorUsers,
    errorTpops,
    errorTpopmassns,
    errorTpopmassnbers,
    errorTpopfreiwkontrs,
    errorTpopkontrzaehls,
    errorZiels,
    errorZielbers,
    errorAll,
  ].filter(e => !!e)

  const data = {
    ...dataWertes,
    ...dataUsers,
    ...dataTpops,
    ...dataTpopmassns,
    ...dataTpopmassnbers,
    ...dataTpopfreiwkontrs,
    ...dataTpopkontrzaehls,
    ...dataZiels,
    ...dataZielbers,
    ...dataAll,
  }

  const loading = anyQueryIsLoading(queryLoadingArray)
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const [nodes, setNodes] = useState([])

  useEffect(() => {
    console.log('TreeContainer, building nodes')
    setNodes(
      buildNodes({
        treeName,
        role,
        nodeFilter,
        data,
        dataAdresses: dataWertes,
        dataApberrelevantGrundWertes: dataWertes,
        dataTpopkontrzaehlEinheitWertes: dataWertes,
        dataEkAbrechnungstypWertes: dataWertes,
        dataUsers,
        dataTpops,
        dataTpopmassns,
        dataTpopmassnbers,
        dataTpopfreiwkontrs,
        dataTpopkontrzaehls,
        dataZiels,
        dataZielbers,
        loadingAdresses: loadingWertes,
        loadingApberrelevantGrundWertes: loadingWertes,
        loadingTpopkontrzaehlEinheitWertes: loadingWertes,
        loadingEkAbrechnungstypWertes: loadingWertes,
        loadingUsers,
        loadingTpops,
        loadingTpopmassns,
        loadingTpopmassnbers,
        loadingTpopfreiwkontrs,
        loadingTpopkontrzaehls,
        loadingZiels,
        loadingZielbers,
        loadingAll,
        store,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, activeNodeArray, openNodes, openNodes.length, activeNodes])

  useEffect(() => {
    // if activeNodeArray.length === 1
    // and there is only one projekt
    // open it
    // dont do this in render!
    const projekteNodes = nodes.filter(n => n.menuType === 'projekt')
    const existsOnlyOneProjekt = projekteNodes.length === 1
    const projektNode = projekteNodes[0]
    if (
      activeNodes.projektFolder &&
      !activeNodes.projekt &&
      existsOnlyOneProjekt &&
      projektNode
    ) {
      const projektUrl = [...projektNode.url]
      setActiveNodeArray(projektUrl)
      // add projekt to open nodes
      setOpenNodes([...openNodes, projektUrl])
    }
  }, [
    activeNodes.projekt,
    activeNodes.projektFolder,
    loading,
    nodes,
    openNodes,
    setActiveNodeArray,
    setOpenNodes,
  ])

  const listRef = React.createRef()

  useEffect(() => {
    if (listRef && listRef.current) {
      const index = findIndex(nodes, node => isEqual(node.url, activeNodeArray))
      listRef.current.scrollToItem(index)
    }
  }, [loading, activeNodeArray, nodes, listRef])

  //console.log('Tree rendering')

  if (existsPermissionError(queryErrorArray)) {
    // during login don't show permission error
    if (!token) return null
    // if token is not accepted, ask user to logout
    return (
      <ErrorContainer>
        <div>Ihre Anmeldung ist nicht mehr gültig.</div>
        <div>Bitte melden Sie sich neu an.</div>
        <LogoutButton
          variant="outlined"
          onClick={() => {
            logout(idb)
          }}
        >
          Neu anmelden
        </LogoutButton>
      </ErrorContainer>
    )
  }
  const error = anyQueryReturnsError(queryErrorArray)
  if (error) {
    return <ErrorContainer>{`Fehler: ${error.message}`}</ErrorContainer>
  }

  return (
    <Container data-loading={loading}>
      <StyledList
        height={treeHeight - 64 - 64}
        itemCount={nodes.length}
        itemSize={singleRowHeight}
        width={treeWidth}
        ref={listRef}
      >
        {({ index, style }) => (
          <Row
            key={index}
            style={style}
            index={index}
            node={nodes[index]}
            treeName={treeName}
          />
        )}
      </StyledList>
    </Container>
  )
}

export default observer(Tree)
