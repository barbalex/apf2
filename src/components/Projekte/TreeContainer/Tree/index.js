// @flow
import React, { useContext, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'
import jwtDecode from 'jwt-decode'

import Row from './Row'

import mobxStoreContext from '../../../../mobxStoreContext'
import buildVariables from './buildVariables'
import queryAdresses from './queryAdresses'
import queryCurrentIssues from './queryCurrentIssues'
import queryUsers from './queryUsers'
import queryProjekts from './queryProjekts'
import queryApberuebersichts from './queryApberuebersichts'
import queryAps from './queryAps'
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
import queryBeobZugeordnets from './queryBeobZugeordnets'
import queryZiels from './queryZiels'
import queryZielbers from './queryZielbers'
import queryErfkrits from './queryErfkrits'
import queryApbers from './queryApbers'
import queryBers from './queryBers'
import queryAparts from './queryAparts'
import queryAssozarts from './queryAssozarts'
import queryEkfzaehleinheits from './queryEkfzaehleinheits'
import queryBeobNichtBeurteilts from './queryBeobNichtBeurteilts'
import queryBeobNichtZuzuordnens from './queryBeobNichtZuzuordnens'
import buildNodes from '../nodes'
import logout from '../../../../modules/logout'
import anyQueryReturnsPermissionError from '../../../../modules/anyQueryReturnsPermissionError'
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

type Props = {
  treeName: String,
  dimensions: Object,
  mapBeobZugeordnetVisible: boolean,
  mapBeobNichtBeurteiltVisible: boolean,
  mapBeobNichtZuzuordnenVisible: boolean,
  mapPopVisible: boolean,
  mapTpopVisible: boolean,
}

const Tree = ({ treeName, dimensions }: Props) => {
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]
  const { activeNodeArray, setNodes, openNodes, nodeLabelFilter } = tree
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { nodeFilter, user, setRefetchKey, setTreeKey } = mobxStore
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
  } = buildVariables({ treeName, mobxStore })

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
  const queryApberuebersichtsFilter = { projId: { in: projekt } }
  if (!!nodeLabelFilter.apberuebersicht) {
    queryApberuebersichtsFilter.label = {
      includesInsensitive: nodeLabelFilter.apberuebersicht,
    }
  }
  const {
    data: dataApberuebersichts,
    error: errorApberuebersichts,
    loading: loadingApberuebersichts,
    refetch: refetchApberuebersichts,
  } = useQuery(queryApberuebersichts, {
    variables: { isProjekt, filter: queryApberuebersichtsFilter },
  })
  setRefetchKey({
    key: 'apberuebersichts',
    value: refetchApberuebersichts,
  })
  const queryApsFilter = { ...apFilter }
  if (nodeLabelFilter.ap) {
    queryApsFilter.label = { includesInsensitive: nodeLabelFilter.ap }
  }
  const {
    data: dataAps,
    error: errorAps,
    loading: loadingAps,
    refetch: refetchAps,
  } = useQuery(queryAps, {
    variables: { isProjekt, filter: queryApsFilter },
  })
  setRefetchKey({
    key: 'aps',
    value: refetchAps,
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
  const queryBeobZugeordnetsFilter = { tpopId: { in: tpop } }
  if (!!nodeLabelFilter.beob) {
    queryBeobZugeordnetsFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const {
    data: dataBeobZugeordnets,
    error: errorBeobZugeordnets,
    loading: loadingBeobZugeordnets,
    refetch: refetchBeobZugeordnets,
  } = useQuery(queryBeobZugeordnets, {
    variables: { isTpop, filter: queryBeobZugeordnetsFilter },
  })
  setRefetchKey({
    key: 'beobZugeordnets',
    value: refetchBeobZugeordnets,
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
  const queryApbersFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.apber) {
    queryApbersFilter.label = { includesInsensitive: nodeLabelFilter.apber }
  }
  const {
    data: dataApbers,
    error: errorApbers,
    loading: loadingApbers,
    refetch: refetchApbers,
  } = useQuery(queryApbers, {
    variables: { isAp, filter: queryApbersFilter },
  })
  setRefetchKey({
    key: 'apbers',
    value: refetchApbers,
  })
  const queryBersFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.ber) {
    queryBersFilter.label = {
      includesInsensitive: nodeLabelFilter.ber,
    }
  }
  const {
    data: dataBers,
    error: errorBers,
    loading: loadingBers,
    refetch: refetchBers,
  } = useQuery(queryBers, {
    variables: { isAp, filter: queryBersFilter },
  })
  setRefetchKey({
    key: 'bers',
    value: refetchBers,
  })
  const queryApartsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.apart) {
    queryApartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
  }
  const {
    data: dataAparts,
    error: errorAparts,
    loading: loadingAparts,
    refetch: refetchAparts,
  } = useQuery(queryAparts, {
    variables: { isAp, filter: queryApartsFilter },
  })
  setRefetchKey({
    key: 'aparts',
    value: refetchAparts,
  })
  const queryAssozartsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.assozart) {
    queryAssozartsFilter.label = {
      includesInsensitive: nodeLabelFilter.assozart,
    }
  }
  const {
    data: dataAssozarts,
    error: errorAssozarts,
    loading: loadingAssozarts,
    refetch: refetchAssozarts,
  } = useQuery(queryAssozarts, {
    variables: { isAp, filter: queryAssozartsFilter },
  })
  setRefetchKey({
    key: 'assozarts',
    value: refetchAssozarts,
  })
  const queryEkfzaehleinheitsFilter = { apId: { in: ap } }
  if (!!nodeLabelFilter.ekfzaehleinheit) {
    queryEkfzaehleinheitsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekfzaehleinheit,
    }
  }
  const {
    data: dataEkfzaehleinheits,
    error: errorEkfzaehleinheits,
    loading: loadingEkfzaehleinheits,
    refetch: refetchEkfzaehleinheits,
  } = useQuery(queryEkfzaehleinheits, {
    variables: { isAp, filter: queryEkfzaehleinheitsFilter },
  })
  setRefetchKey({
    key: 'ekfzaehleinheits',
    value: refetchEkfzaehleinheits,
  })
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
  const {
    data: dataBeobNichtBeurteilts,
    error: errorBeobNichtBeurteilts,
    loading: loadingBeobNichtBeurteilts,
    refetch: refetchBeobNichtBeurteilts,
  } = useQuery(queryBeobNichtBeurteilts, {
    variables: {
      isAp,
      filter: queryBeobNichtBeurteiltsFilter,
    },
  })
  setRefetchKey({
    key: 'beobNichtBeurteilts',
    value: refetchBeobNichtBeurteilts,
  })
  const queryBeobNichtZuzuordnensFilter = {
    nichtZuordnen: { equalTo: true },
    apId: { in: ap },
  }
  if (!!nodeLabelFilter.beob) {
    queryBeobNichtZuzuordnensFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const {
    data: dataBeobNichtZuzuordnens,
    error: errorBeobNichtZuzuordnens,
    loading: loadingBeobNichtZuzuordnens,
    refetch: refetchBeobNichtZuzuordnens,
  } = useQuery(queryBeobNichtZuzuordnens, {
    variables: { isAp, filter: queryBeobNichtZuzuordnensFilter },
  })
  setRefetchKey({
    key: 'beobNichtZuzuordnens',
    value: refetchBeobNichtZuzuordnens,
  })
  const queryAdressesFilter = nodeLabelFilter.adresse
    ? { label: { includesInsensitive: nodeLabelFilter.adresse } }
    : { id: { isNull: false } }
  const {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
    refetch: refetchAdresses,
  } = useQuery(queryAdresses, {
    variables: { isWerteListen, filter: queryAdressesFilter },
  })
  setRefetchKey({
    key: 'adresses',
    value: refetchAdresses,
  })
  const {
    data: dataCurrentIssues,
    error: errorCurrentIssues,
    loading: loadingCurrentIssues,
  } = useQuery(queryCurrentIssues)

  const queryLoadingArray = [
    loadingCurrentIssues,
    loadingAdresses,
    loadingUsers,
    loadingProjekts,
    loadingApberuebersichts,
    loadingAps,
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
    loadingBeobZugeordnets,
    loadingZiels,
    loadingZielbers,
    loadingErfkrits,
    loadingApbers,
    loadingBers,
    loadingAparts,
    loadingAssozarts,
    loadingEkfzaehleinheits,
    loadingBeobNichtBeurteilts,
    loadingBeobNichtZuzuordnens,
  ]

  const queryErrorArray = [
    errorCurrentIssues,
    errorAdresses,
    errorUsers,
    errorProjekts,
    errorApberuebersichts,
    errorAps,
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
    errorBeobZugeordnets,
    errorZiels,
    errorZielbers,
    errorErfkrits,
    errorApbers,
    errorBers,
    errorAparts,
    errorAssozarts,
    errorEkfzaehleinheits,
    errorBeobNichtBeurteilts,
    errorBeobNichtZuzuordnens,
  ].filter(e => !!e)

  const data = {
    ...dataCurrentIssues,
    ...dataAdresses,
    ...dataUsers,
    ...dataProjekts,
    ...dataApberuebersichts,
    ...dataAps,
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
    ...dataBeobZugeordnets,
    ...dataZiels,
    ...dataZielbers,
    ...dataErfkrits,
    ...dataApbers,
    ...dataBers,
    ...dataAparts,
    ...dataAssozarts,
    ...dataEkfzaehleinheits,
    ...dataBeobNichtBeurteilts,
    ...dataBeobNichtZuzuordnens,
  }

  const loading = anyQueryIsLoading(queryLoadingArray)
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const nodes = buildNodes({
    treeName,
    role,
    nodeFilter,
    data,
    dataCurrentIssues,
    dataAdresses,
    dataUsers,
    dataProjekts,
    dataApberuebersichts,
    dataAps,
    dataPops,
    dataTpops,
    dataTpopmassns,
    dataTpopmassnbers,
    dataTpopfeldkontrs,
    dataTpopfreiwkontrs,
    dataTpopkontrzaehls,
    dataTpopbers,
    dataBeobZugeordnets,
    dataZiels,
    dataZielbers,
    dataErfkrits,
    dataApbers,
    dataBers,
    dataAssozarts,
    dataEkfzaehleinheits,
    dataBeobNichtBeurteilts,
    dataBeobNichtZuzuordnens,
    loadingAdresses,
    loadingCurrentIssues,
    loadingUsers,
    loadingProjekts,
    loadingApberuebersichts,
    loadingAps,
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
    loadingBeobZugeordnets,
    loadingZiels,
    loadingZielbers,
    loadingErfkrits,
    loadingApbers,
    loadingBers,
    loadingAparts,
    loadingAssozarts,
    loadingEkfzaehleinheits,
    loadingBeobNichtBeurteilts,
    loadingBeobNichtZuzuordnens,
    mobxStore,
  })
  setNodes(nodes)

  useEffect(() => {
    /**
     * if activeNodeArray.length === 1
     * and there is only one projekt
     * open it
     * dont do this in render!
     */
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
      setTreeKey({
        value: projektUrl,
        tree: treeName,
        key: 'activeNodeArray',
      })
      // add projekt to open nodes
      setTreeKey({
        value: [...openNodes, projektUrl],
        tree: treeName,
        key: 'openNodes',
      })
    }
  }, [loading])

  const listRef = React.createRef()

  useEffect(() => {
    if (listRef && listRef.current) {
      const index = findIndex(nodes, node => isEqual(node.url, activeNodeArray))
      listRef.current.scrollToItem(index)
    }
  }, [loading, activeNodeArray, nodes, listRef])

  if (anyQueryReturnsPermissionError(queryErrorArray)) {
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

  const height = isNaN(dimensions.height) ? 250 : dimensions.height - 58
  const width = isNaN(dimensions.width) ? 250 : dimensions.width

  return (
    <Container data-loading={loading}>
      <StyledList
        height={height}
        itemCount={nodes.length}
        itemSize={singleRowHeight}
        width={width}
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
