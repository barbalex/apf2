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
import queryProjekts from './queryProjekts'
import queryMessages from './queryMessages'
import queryPops from './queryPops'
import queryPopbers from './queryPopbers'
import queryPopmassnbers from './queryPopmassnbers'
import queryTpops from './queryTpops'
import queryTpopmassns from './queryTpopmassns'
import queryTpopmassnbers from './queryTpopmassnbers'
import queryTpopfeldkontrs from './queryTpopfeldkontrs'
import queryTpopfreiwkontrs from './queryTpopfreiwkontrs'
import queryTpopkontrzaehls from './queryTpopkontrzaehls'
import queryTpopbers from './queryTpopbers'
import queryZiels from './queryZiels'
import queryZielbers from './queryZielbers'
import queryErfkrits from './queryErfkrits'
import queryAll from './queryAll'
import queryEkzaehleinheits from './queryEkzaehleinheits'
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

  const {
    data: dataProjekts,
    error: errorProjekts,
    loading: loadingProjekts,
    refetch: refetchProjekts,
  } = useQuery(queryProjekts)
  setRefetchKey({
    key: 'projekts',
    value: refetchProjekts,
  })
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
  const queryPopsFilter = { ...popFilter }
  if (!!nodeLabelFilter.pop) {
    queryPopsFilter.label = {
      includesInsensitive: nodeLabelFilter.pop,
    }
  }
  const {
    data: dataPops,
    error: errorPops,
    loading: loadingPops,
    refetch: refetchPops,
  } = useQuery(queryPops, {
    variables: {
      isAp,
      filter: queryPopsFilter,
    },
  })
  setRefetchKey({
    key: 'pops',
    value: refetchPops,
  })
  const queryPopbersFilter = { popId: { in: pop } }
  if (!!nodeLabelFilter.popber) {
    queryPopbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popber,
    }
  }
  const {
    data: dataPopbers,
    error: errorPopbers,
    loading: loadingPopbers,
    refetch: refetchPopbers,
  } = useQuery(queryPopbers, {
    variables: { isPop, filter: queryPopbersFilter },
  })
  setRefetchKey({
    key: 'popbers',
    value: refetchPopbers,
  })
  const queryPopmassnbersFilter = { popId: { in: pop } }
  if (!!nodeLabelFilter.popmassnber) {
    queryPopmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }
  const {
    data: dataPopmassnbers,
    error: errorPopmassnbers,
    loading: loadingPopmassnbers,
    refetch: refetchPopmassnbers,
  } = useQuery(queryPopmassnbers, {
    variables: { isPop, filter: queryPopmassnbersFilter },
  })
  setRefetchKey({
    key: 'popmassnbers',
    value: refetchPopmassnbers,
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
  const queryTpopfeldkontrsFilter = { ...tpopfeldkontrFilter }
  if (!!nodeLabelFilter.tpopkontr) {
    queryTpopfeldkontrsFilter.labelEk = {
      includesInsensitive: nodeLabelFilter.tpopkontr,
    }
  }
  const {
    data: dataTpopfeldkontrs,
    error: errorTpopfeldkontrs,
    loading: loadingTpopfeldkontrs,
    refetch: refetchTpopfeldkontrs,
  } = useQuery(queryTpopfeldkontrs, {
    variables: { isTpop, filter: queryTpopfeldkontrsFilter },
  })
  setRefetchKey({
    key: 'tpopfeldkontrs',
    value: refetchTpopfeldkontrs,
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
  const queryTpopbersFilter = { tpopId: { in: tpop } }
  if (!!nodeLabelFilter.tpopber) {
    queryTpopbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }
  const {
    data: dataTpopbers,
    error: errorTpopbers,
    loading: loadingTpopbers,
    refetch: refetchTpopbers,
  } = useQuery(queryTpopbers, {
    variables: { isTpop, filter: queryTpopbersFilter },
  })
  setRefetchKey({
    key: 'tpopbers',
    value: refetchTpopbers,
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
  const queryErfkritsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.erfkrit) {
    queryErfkritsFilter.label = {
      includesInsensitive: nodeLabelFilter.erfkrit,
    }
  }
  const {
    data: dataErfkrits,
    error: errorErfkrits,
    loading: loadingErfkrits,
    refetch: refetchErfkrits,
  } = useQuery(queryErfkrits, {
    variables: { isAp, filter: queryErfkritsFilter },
  })
  setRefetchKey({
    key: 'erfkrits',
    value: refetchErfkrits,
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
  const {
    data: dataAll,
    error: errorAll,
    loading: loadingAll,
    refetch: refetchAll,
  } = useQuery(queryAll, {
    variables: {
      isProjekt,
      isAp,
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
    },
  })
  setRefetchKey({
    key: 'all',
    value: refetchAll,
  })

  const queryEkzaehleinheitsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.ekzaehleinheit) {
    queryEkzaehleinheitsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekzaehleinheit,
    }
  }
  const {
    data: dataEkzaehleinheits,
    error: errorEkzaehleinheits,
    loading: loadingEkzaehleinheits,
    refetch: refetchEkzaehleinheits,
  } = useQuery(queryEkzaehleinheits, {
    variables: { isAp, filter: queryEkzaehleinheitsFilter },
  })
  setRefetchKey({
    key: 'ekzaehleinheits',
    value: refetchEkzaehleinheits,
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

  const {
    data: dataMessages,
    error: errorMessages,
    loading: loadingMessages,
  } = useQuery(queryMessages)

  const queryLoadingArray = [
    loadingMessages,
    loadingWertes,
    loadingUsers,
    loadingProjekts,
    loadingPops,
    loadingPopbers,
    loadingPopmassnbers,
    loadingTpops,
    loadingTpopmassns,
    loadingTpopmassnbers,
    loadingTpopfeldkontrs,
    loadingTpopfreiwkontrs,
    loadingTpopkontrzaehls,
    loadingTpopbers,
    loadingZiels,
    loadingZielbers,
    loadingErfkrits,
    loadingAll,
    loadingEkzaehleinheits,
  ]

  const queryErrorArray = [
    errorMessages,
    errorWertes,
    errorUsers,
    errorProjekts,
    errorPops,
    errorPopbers,
    errorPopmassnbers,
    errorTpops,
    errorTpopmassns,
    errorTpopmassnbers,
    errorTpopfeldkontrs,
    errorTpopfreiwkontrs,
    errorTpopkontrzaehls,
    errorTpopbers,
    errorZiels,
    errorZielbers,
    errorErfkrits,
    errorAll,
    errorEkzaehleinheits,
  ].filter(e => !!e)

  const data = {
    ...dataMessages,
    ...dataWertes,
    ...dataUsers,
    ...dataProjekts,
    ...dataPops,
    ...dataPopbers,
    ...dataPopmassnbers,
    ...dataTpops,
    ...dataTpopmassns,
    ...dataTpopmassnbers,
    ...dataTpopfeldkontrs,
    ...dataTpopfreiwkontrs,
    ...dataTpopkontrzaehls,
    ...dataTpopbers,
    ...dataZiels,
    ...dataZielbers,
    ...dataErfkrits,
    ...dataAll,
    ...dataEkzaehleinheits,
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
        dataMessages,
        dataAdresses: dataWertes,
        dataApberrelevantGrundWertes: dataWertes,
        dataTpopkontrzaehlEinheitWertes: dataWertes,
        dataEkAbrechnungstypWertes: dataWertes,
        dataUsers,
        dataProjekts,
        dataPops,
        dataTpops,
        dataTpopmassns,
        dataTpopmassnbers,
        dataTpopfeldkontrs,
        dataTpopfreiwkontrs,
        dataTpopkontrzaehls,
        dataTpopbers,
        dataZiels,
        dataZielbers,
        dataErfkrits,
        dataEkzaehleinheits,
        loadingAdresses: loadingWertes,
        loadingApberrelevantGrundWertes: loadingWertes,
        loadingTpopkontrzaehlEinheitWertes: loadingWertes,
        loadingEkAbrechnungstypWertes: loadingWertes,
        loadingMessages,
        loadingUsers,
        loadingProjekts,
        loadingPops,
        loadingPopbers,
        loadingPopmassnbers,
        loadingTpops,
        loadingTpopmassns,
        loadingTpopmassnbers,
        loadingTpopfeldkontrs,
        loadingTpopfreiwkontrs,
        loadingTpopkontrzaehls,
        loadingTpopbers,
        loadingZiels,
        loadingZielbers,
        loadingErfkrits,
        loadingAll,
        loadingEkzaehleinheits,
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
