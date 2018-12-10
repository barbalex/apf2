// @flow
import React, { useContext, useCallback, useEffect } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import Button from '@material-ui/core/Button'
import List from 'react-virtualized/dist/commonjs/List'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'
import jwtDecode from 'jwt-decode'

import Row from './Row'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import mobxStoreContext from '../../../../mobxStoreContext'
import buildVariables from './buildVariables'
import queryAdresses from './queryAdresses'
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
import queryIdealbiotops from './queryIdealbiotops'
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
  /* need this because react-virtualized scrolls too far down, see
   * https://github.com/bvaughn/react-virtualized/issues/543
   */
  .ReactVirtualized__Grid {
    overflow-x: hidden !important;
  }
`
const ListContainer = styled(List)`
  font-size: 14px;
  font-weight: normal;
  * {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: normal;
  }
  &:focus {
    outline-color: rgb(48, 48, 48) !important;
  }
`
const LoadingDiv = styled.div`
  padding-left: 15px;
  font-size: 14px;
`
const ErrorContainer = styled.div`
  padding: 15px;
`
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`

type Props = {
  treeName: String,
  mapBeobZugeordnetVisible: boolean,
  mapBeobNichtBeurteiltVisible: boolean,
  mapBeobNichtZuzuordnenVisible: boolean,
  mapPopVisible: boolean,
  mapTpopVisible: boolean,
}

const noRowsRenderer = () => (
  <Container data-loading={true}>
    <LoadingDiv>lade Daten...</LoadingDiv>
  </Container>
)

const Tree = ({ treeName }: Props) => {
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]
  const { activeNodeArray, setNodes, openNodes } = tree
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { nodeFilter, user, setRefetchKey, setTreeKey } = mobxStore
  const { idb } = useContext(idbContext)
  const {
    projekt,
    isProjekt,
    apFilter,
    //apFilterSet,
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
    isAdresse,
  } = buildVariables({
    treeName,
    mobxStore,
  })

  const {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
    refetch: refetchAdresses,
  } = useQuery(queryAdresses, {
    suspend: false,
    variables: { isWerteListen, isAdresse },
  })
  setRefetchKey({
    key: 'adresses',
    value: refetchAdresses,
  })
  const {
    data: dataUsers,
    error: errorUsers,
    loading: loadingUsers,
    refetch: refetchUsers,
  } = useQuery(queryUsers, {
    suspend: false,
  })
  setRefetchKey({
    key: 'users',
    value: refetchUsers,
  })
  const {
    data: dataProjekts,
    error: errorProjekts,
    loading: loadingProjekts,
    refetch: refetchProjekts,
  } = useQuery(queryProjekts, {
    suspend: false,
  })
  setRefetchKey({
    key: 'projekts',
    value: refetchProjekts,
  })
  const {
    data: dataApberuebersichts,
    error: errorApberuebersichts,
    loading: loadingApberuebersichts,
    refetch: refetchApberuebersichts,
  } = useQuery(queryApberuebersichts, {
    suspend: false,
    variables: { isProjekt, projekt },
  })
  setRefetchKey({
    key: 'apberuebersichts',
    value: refetchApberuebersichts,
  })
  const {
    data: dataAps,
    error: errorAps,
    loading: loadingAps,
    refetch: refetchAps,
  } = useQuery(queryAps, {
    suspend: false,
    variables: { isProjekt, apFilter },
  })
  setRefetchKey({
    key: 'aps',
    value: refetchAps,
  })
  const {
    data: dataPops,
    error: errorPops,
    loading: loadingPops,
    refetch: refetchPops,
  } = useQuery(queryPops, {
    suspend: false,
    variables: { isAp, popFilter },
  })
  setRefetchKey({
    key: 'pops',
    value: refetchPops,
  })
  const {
    data: dataPopbers,
    error: errorPopbers,
    loading: loadingPopbers,
    refetch: refetchPopbers,
  } = useQuery(queryPopbers, {
    suspend: false,
    variables: { isPop, pop },
  })
  setRefetchKey({
    key: 'popbers',
    value: refetchPopbers,
  })
  const {
    data: dataPopmassnbers,
    error: errorPopmassnbers,
    loading: loadingPopmassnbers,
    refetch: refetchPopmassnbers,
  } = useQuery(queryPopmassnbers, {
    suspend: false,
    variables: { isPop, pop },
  })
  setRefetchKey({
    key: 'popmassnbers',
    value: refetchPopmassnbers,
  })
  const {
    data: dataTpops,
    error: errorTpops,
    loading: loadingTpops,
    refetch: refetchTpops,
  } = useQuery(queryTpops, {
    suspend: false,
    variables: { isPop, tpopFilter },
  })
  setRefetchKey({
    key: 'tpops',
    value: refetchTpops,
  })
  const {
    data: dataTpopmassns,
    error: errorTpopmassns,
    loading: loadingTpopmassns,
    refetch: refetchTpopmassns,
  } = useQuery(queryTpopmassns, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  setRefetchKey({
    key: 'tpopmassns',
    value: refetchTpopmassns,
  })
  const {
    data: dataTpopmassnbers,
    error: errorTpopmassnbers,
    loading: loadingTpopmassnbers,
    refetch: refetchTpopmassnbers,
  } = useQuery(queryTpopmassnbers, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  setRefetchKey({
    key: 'tpopmassnbers',
    value: refetchTpopmassnbers,
  })
  const {
    data: dataTpopfeldkontrs,
    error: errorTpopfeldkontrs,
    loading: loadingTpopfeldkontrs,
    refetch: refetchTpopfeldkontrs,
  } = useQuery(queryTpopfeldkontrs, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  setRefetchKey({
    key: 'tpopfeldkontrs',
    value: refetchTpopfeldkontrs,
  })
  const {
    data: dataTpopfreiwkontrs,
    error: errorTpopfreiwkontrs,
    loading: loadingTpopfreiwkontrs,
    refetch: refetchTpopfreiwkontrs,
  } = useQuery(queryTpopfreiwkontrs, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  setRefetchKey({
    key: 'tpopfreiwkontrs',
    value: refetchTpopfreiwkontrs,
  })
  const {
    data: dataTpopkontrzaehls,
    error: errorTpopkontrzaehls,
    loading: loadingTpopkontrzaehls,
    refetch: refetchTpopkontrzaehls,
  } = useQuery(queryTpopkontrzaehls, {
    suspend: false,
    variables: { isTpopkontr, tpopkontr },
  })
  setRefetchKey({
    key: 'tpopkontrzaehls',
    value: refetchTpopkontrzaehls,
  })
  const {
    data: dataTpopbers,
    error: errorTpopbers,
    loading: loadingTpopbers,
    refetch: refetchTpopbers,
  } = useQuery(queryTpopbers, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  setRefetchKey({
    key: 'tpopbers',
    value: refetchTpopbers,
  })
  const {
    data: dataBeobZugeordnets,
    error: errorBeobZugeordnets,
    loading: loadingBeobZugeordnets,
    refetch: refetchBeobZugeordnets,
  } = useQuery(queryBeobZugeordnets, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  setRefetchKey({
    key: 'beobZugeordnets',
    value: refetchBeobZugeordnets,
  })
  const {
    data: dataZiels,
    error: errorZiels,
    loading: loadingZiels,
    refetch: refetchZiels,
  } = useQuery(queryZiels, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'ziels',
    value: refetchZiels,
  })
  const {
    data: dataZielbers,
    error: errorZielbers,
    loading: loadingZielbers,
    refetch: refetchZielbers,
  } = useQuery(queryZielbers, {
    suspend: false,
    variables: { isZiel, ziel },
  })
  setRefetchKey({
    key: 'zielbers',
    value: refetchZielbers,
  })
  const {
    data: dataErfkrits,
    error: errorErfkrits,
    loading: loadingErfkrits,
    refetch: refetchErfkrits,
  } = useQuery(queryErfkrits, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'erfkrits',
    value: refetchErfkrits,
  })
  const {
    data: dataApbers,
    error: errorApbers,
    loading: loadingApbers,
    refetch: refetchApbers,
  } = useQuery(queryApbers, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'apbers',
    value: refetchApbers,
  })
  const {
    data: dataBers,
    error: errorBers,
    loading: loadingBers,
    refetch: refetchBers,
  } = useQuery(queryBers, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'bers',
    value: refetchBers,
  })
  const {
    data: dataIdealbiotops,
    error: errorIdealbiotops,
    loading: loadingIdealbiotops,
    refetch: refetchIdealbiotops,
  } = useQuery(queryIdealbiotops, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'idealbiotops',
    value: refetchIdealbiotops,
  })
  const {
    data: dataAparts,
    error: errorAparts,
    loading: loadingAparts,
    refetch: refetchAparts,
  } = useQuery(queryAparts, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'aparts',
    value: refetchAparts,
  })
  const {
    data: dataAssozarts,
    error: errorAssozarts,
    loading: loadingAssozarts,
    refetch: refetchAssozarts,
  } = useQuery(queryAssozarts, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'assozarts',
    value: refetchAssozarts,
  })
  const {
    data: dataEkfzaehleinheits,
    error: errorEkfzaehleinheits,
    loading: loadingEkfzaehleinheits,
    refetch: refetchEkfzaehleinheits,
  } = useQuery(queryEkfzaehleinheits, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'ekfzaehleinheits',
    value: refetchEkfzaehleinheits,
  })
  const {
    data: dataBeobNichtBeurteilts,
    error: errorBeobNichtBeurteilts,
    loading: loadingBeobNichtBeurteilts,
    refetch: refetchBeobNichtBeurteilts,
  } = useQuery(queryBeobNichtBeurteilts, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'beobNichtBeurteilts',
    value: refetchBeobNichtBeurteilts,
  })
  const {
    data: dataBeobNichtZuzuordnens,
    error: errorBeobNichtZuzuordnens,
    loading: loadingBeobNichtZuzuordnens,
    refetch: refetchBeobNichtZuzuordnens,
  } = useQuery(queryBeobNichtZuzuordnens, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'beobNichtZuzuordnens',
    value: refetchBeobNichtZuzuordnens,
  })

  const queryLoadingArray = [
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
    loadingIdealbiotops,
    loadingAparts,
    loadingAssozarts,
    loadingEkfzaehleinheits,
    loadingBeobNichtBeurteilts,
    loadingBeobNichtZuzuordnens,
  ]

  const queryErrorArray = [
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
    errorIdealbiotops,
    errorAparts,
    errorAssozarts,
    errorEkfzaehleinheits,
    errorBeobNichtBeurteilts,
    errorBeobNichtZuzuordnens,
  ].filter(e => !!e)

  const loading = anyQueryIsLoading(queryLoadingArray)
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const nodes = buildNodes({
    treeName,
    role,
    nodeFilter,
    dataAdresses,
    dataUsers,
    dataProjekts,
    dataApberuebersichts,
    dataAps,
    dataPops,
    dataPopbers,
    dataPopmassnbers,
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
    dataIdealbiotops,
    dataAparts,
    dataAssozarts,
    dataEkfzaehleinheits,
    dataBeobNichtBeurteilts,
    dataBeobNichtZuzuordnens,
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
    loadingIdealbiotops,
    loadingAparts,
    loadingAssozarts,
    loadingEkfzaehleinheits,
    loadingBeobNichtBeurteilts,
    loadingBeobNichtZuzuordnens,
    mobxStore,
  })
  setNodes(nodes)

  useEffect(
    () => {
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
    },
    [loading],
  )

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

  const rowRenderer = useCallback(
    ({ key, index, style }) => {
      const node = nodes[index]

      return (
        <Row
          key={key}
          style={style}
          index={index}
          node={node}
          treeName={treeName}
        />
      )
    },
    [treeName, nodes],
  )

  //console.log('Tree rendering')

  return (
    <ErrorBoundary>
      <Container data-loading={loading}>
        <AutoSizer>
          {({ height, width }) => (
            <ListContainer
              height={height}
              rowCount={nodes.length}
              rowHeight={singleRowHeight}
              rowRenderer={rowRenderer}
              noRowsRenderer={noRowsRenderer}
              scrollToIndex={findIndex(nodes, node =>
                isEqual(node.url, activeNodeArray),
              )}
              width={width}
            />
          )}
        </AutoSizer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tree)
