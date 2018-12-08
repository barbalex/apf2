// @flow
import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import get from 'lodash/get'
import upperFirst from 'lodash/upperFirst'
import flatten from 'lodash/flatten'
import Button from '@material-ui/core/Button'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useQuery } from 'react-apollo-hooks'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from '../Karte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import queryAdresses from './adresses'
import queryUsers from './users'
import queryProjekts from './projekts'
import queryApberuebersichts from './apberuebersichts'
import queryAps from './aps'
import queryPops from './pops'
import queryPopbers from './popbers'
import queryPopmassnbers from './popmassnbers'
import queryTpops from './tpops'
import queryTpopmassns from './tpopmassns'
import queryTpopmassnbers from './tpopmassnbers'
import queryTpopfeldkontrs from './tpopfeldkontrs'
import queryTpopfreiwkontrs from './tpopfreiwkontrs'
import queryTpopkontrzaehls from './tpopkontrzaehls'
import queryTpopbers from './tpopbers'
import queryBeobZugeordnets from './beobZugeordnets'
import queryZiels from './ziels'
import queryZielbers from './zielbers'
import queryErfkrits from './erfkrits'
import queryApbers from './apbers'
import queryBers from './bers'
import queryIdealbiotops from './idealbiotops'
import queryAparts from './aparts'
import queryAssozarts from './assozarts'
import queryEkfzaehleinheits from './ekfzaehleinheits'
import queryBeobNichtBeurteilts from './beobNichtBeurteilts'
import queryBeobNichtZuzuordnens from './beobNichtZuzuordnens'
import queryPopForMap from './popForMap'
import queryTpopForMap from './tpopForMap'
import queryBeobZugeordnetForMap from './beobZugeordnetForMap'
import queryBeobNichtBeurteiltForMap from './beobNichtBeurteiltForMap'
import queryBeobNichtZuzuordnenForMap from './beobNichtZuzuordnenForMap'
import queryBeobZugeordnetAssignPolylinesForMap from './beobZugeordnetAssignPolylinesForMap'
import queryBeobAssignLines from './beobAssignLines'
import TreeContainer from '../TreeContainer'
import Daten from '../Daten'
import Exporte from '../Exporte'
import buildNodes from '../TreeContainer/nodes'
import idsInsideFeatureCollection from '../../../modules/idsInsideFeatureCollection'
import logout from '../../../modules/logout'
import buildVariables from './buildVariables'
import anyQueryReturnsPermissionError from '../../../modules/anyQueryReturnsPermissionError'
import anyQueryIsLoading from '../../../modules/anyQueryIsLoading'
import anyQueryReturnsError from '../../../modules/anyQueryReturnsError'
import mobxStoreContext from '../../../mobxStoreContext'
import idbContext from '../../../idbContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
  @media print {
    display: block;
    height: auto !important;
  }
`
const ErrorContainer = styled.div`
  padding: 15px;
`
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`

const enhance = compose(observer)

const ProjekteContainer = props => {
  const {
    treeName,
    tabs: tabsPassed,
    projekteTabs,
  }: {
    treeName: String,
    tabs: Array<String>,
    projekteTabs: Array<String>,
  } = props

  const mobxStore = useContext(mobxStoreContext)
  const {
    activeApfloraLayers,
    mapFilter: mapFilterRaw,
    nodeFilter,
    user,
    isPrint,
  } = mobxStore
  const { activeNodeArray, map, setNodes } = mobxStore[treeName]
  const {
    setIdsFiltered,
    setPopIdsFiltered,
    setTpopIdsFiltered,
    setBeobNichtBeurteiltIdsFiltered,
    setBeobNichtZuzuordnenIdsFiltered,
    setBeobZugeordnetIdsFiltered,
  } = map
  const { idb } = useContext(idbContext)
  const mapFilter = mapFilterRaw.toJSON()

  const {
    projekt,
    projId,
    isProjekt,
    apFilter,
    apFilterSet,
    ap,
    apId,
    isAp,
    ziel,
    isZiel,
    pop,
    isPop,
    popIsActiveInMap,
    popFilter,
    tpop,
    isTpop,
    tpopIsActiveInMap,
    tpopFilter,
    tpopkontr,
    isTpopkontr,
    apIsActiveInMap,
    isWerteListen,
    isAdresse,
    beobNichtBeurteiltIsActiveInMap,
    beobNichtZuzuordnenIsActiveInMap,
    beobZugeordnetAssignPolylinesIsActiveInMap,
    beobZugeordnetIsActiveInMap,
  } = buildVariables({
    treeName,
    mobxStore,
  })

  const {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
  } = useQuery(queryAdresses, {
    suspend: false,
    variables: { isWerteListen, isAdresse },
  })
  const {
    data: dataUsers,
    error: errorUsers,
    loading: loadingUsers,
  } = useQuery(queryUsers, {
    suspend: false,
  })
  const {
    data: dataProjekts,
    error: errorProjekts,
    loading: loadingProjekts,
  } = useQuery(queryProjekts, {
    suspend: false,
  })
  const {
    data: dataApberuebersichts,
    error: errorApberuebersichts,
    loading: loadingApberuebersichts,
  } = useQuery(queryApberuebersichts, {
    suspend: false,
    variables: { isProjekt, projekt },
  })
  const { data: dataAps, error: errorAps, loading: loadingAps } = useQuery(
    queryAps,
    {
      suspend: false,
      variables: { isProjekt, apFilter },
    },
  )
  const { data: dataPops, error: errorPops, loading: loadingPops } = useQuery(
    queryPops,
    {
      suspend: false,
      variables: { isAp, popFilter },
    },
  )
  const {
    data: dataPopbers,
    error: errorPopbers,
    loading: loadingPopbers,
  } = useQuery(queryPopbers, {
    suspend: false,
    variables: { isPop, pop },
  })
  const {
    data: dataPopmassnbers,
    error: errorPopmassnbers,
    loading: loadingPopmassnbers,
  } = useQuery(queryPopmassnbers, {
    suspend: false,
    variables: { isPop, pop },
  })
  const {
    data: dataTpops,
    error: errorTpops,
    loading: loadingTpops,
  } = useQuery(queryTpops, {
    suspend: false,
    variables: { isPop, tpopFilter },
  })
  const {
    data: dataTpopmassns,
    error: errorTpopmassns,
    loading: loadingTpopmassns,
  } = useQuery(queryTpopmassns, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  const {
    data: dataTpopmassnbers,
    error: errorTpopmassnbers,
    loading: loadingTpopmassnbers,
  } = useQuery(queryTpopmassnbers, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  const {
    data: dataTpopfeldkontrs,
    error: errorTpopfeldkontrs,
    loading: loadingTpopfeldkontrs,
  } = useQuery(queryTpopfeldkontrs, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  const {
    data: dataTpopfreiwkontrs,
    error: errorTpopfreiwkontrs,
    loading: loadingTpopfreiwkontrs,
  } = useQuery(queryTpopfreiwkontrs, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  const {
    data: dataTpopkontrzaehls,
    error: errorTpopkontrzaehls,
    loading: loadingTpopkontrzaehls,
  } = useQuery(queryTpopkontrzaehls, {
    suspend: false,
    variables: { isTpopkontr, tpopkontr },
  })
  const {
    data: dataTpopbers,
    error: errorTpopbers,
    loading: loadingTpopbers,
  } = useQuery(queryTpopbers, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  const {
    data: dataBeobZugeordnets,
    error: errorBeobZugeordnets,
    loading: loadingBeobZugeordnets,
  } = useQuery(queryBeobZugeordnets, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  const {
    data: dataZiels,
    error: errorZiels,
    loading: loadingZiels,
  } = useQuery(queryZiels, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataZielbers,
    error: errorZielbers,
    loading: loadingZielbers,
  } = useQuery(queryZielbers, {
    suspend: false,
    variables: { isZiel, ziel },
  })
  const {
    data: dataErfkrits,
    error: errorErfkrits,
    loading: loadingErfkrits,
  } = useQuery(queryErfkrits, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataApbers,
    error: errorApbers,
    loading: loadingApbers,
  } = useQuery(queryApbers, {
    suspend: false,
    variables: { isAp, ap },
  })
  const { data: dataBers, error: errorBers, loading: loadingBers } = useQuery(
    queryBers,
    {
      suspend: false,
      variables: { isAp, ap },
    },
  )
  const {
    data: dataIdealbiotops,
    error: errorIdealbiotops,
    loading: loadingIdealbiotops,
  } = useQuery(queryIdealbiotops, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataAparts,
    error: errorAparts,
    loading: loadingAparts,
  } = useQuery(queryAparts, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataAssozarts,
    error: errorAssozarts,
    loading: loadingAssozarts,
  } = useQuery(queryAssozarts, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataEkfzaehleinheits,
    error: errorEkfzaehleinheits,
    loading: loadingEkfzaehleinheits,
  } = useQuery(queryEkfzaehleinheits, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataBeobNichtBeurteilts,
    error: errorBeobNichtBeurteilts,
    loading: loadingBeobNichtBeurteilts,
  } = useQuery(queryBeobNichtBeurteilts, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataBeobNichtZuzuordnens,
    error: errorBeobNichtZuzuordnens,
    loading: loadingBeobNichtZuzuordnens,
  } = useQuery(queryBeobNichtZuzuordnens, {
    suspend: false,
    variables: { isAp, ap },
  })
  const {
    data: dataPopForMap,
    error: errorPopForMap,
    loading: loadingPopForMap,
  } = useQuery(queryPopForMap, {
    suspend: false,
    variables: { apId, projId, popIsActiveInMap },
  })
  const {
    data: dataTpopForMap,
    error: errorTpopForMap,
    loading: loadingTpopForMap,
  } = useQuery(queryTpopForMap, {
    suspend: false,
    variables: { projId, apId, tpopIsActiveInMap },
  })
  const {
    data: dataBeobZugeordnetForMap,
    error: errorBeobZugeordnetForMap,
    loading: loadingBeobZugeordnetForMap,
  } = useQuery(queryBeobZugeordnetForMap, {
    suspend: false,
    variables: { projId, apId, beobZugeordnetIsActiveInMap },
  })
  const {
    data: dataBeobNichtBeurteiltForMap,
    error: errorBeobNichtBeurteiltForMap,
    loading: loadingBeobNichtBeurteiltForMap,
  } = useQuery(queryBeobNichtBeurteiltForMap, {
    suspend: false,
    variables: { projId, apId, beobNichtBeurteiltIsActiveInMap },
  })
  const {
    data: dataBeobNichtZuzuordnenForMap,
    error: errorBeobNichtZuzuordnenForMap,
    loading: loadingBeobNichtZuzuordnenForMap,
  } = useQuery(queryBeobNichtZuzuordnenForMap, {
    suspend: false,
    variables: { projId, apId, beobNichtZuzuordnenIsActiveInMap },
  })
  const {
    data: dataBeobZugeordnetAssignPolylinesForMap,
    error: errorBeobZugeordnetAssignPolylinesForMap,
    loading: loadingBeobZugeordnetAssignPolylinesForMap,
  } = useQuery(queryBeobZugeordnetAssignPolylinesForMap, {
    suspend: false,
    variables: { ap, beobZugeordnetAssignPolylinesIsActiveInMap },
  })
  const {
    data: dataBeobAssignLines,
    error: errorBeobAssignLines,
    loading: loadingAssignLines,
  } = useQuery(queryBeobAssignLines, {
    suspend: false,
    variables: {
      projId,
      beobZugeordnetAssignPolylinesIsActiveInMap,
      apId,
      isAp,
    },
  })

  // TODO: add all
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
  ]

  // TODO: add all (copy from above)
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
  ].filter(e => !!e)
  console.log('ProjektContainer, queryErrorArray:', queryErrorArray)

  const loading = anyQueryIsLoading(queryLoadingArray)

  // TODO:
  const refetch = query => {
    if (query && props[`data${upperFirst(query)}`]) {
      props[`data${upperFirst(query)}`].refetch()
    }
  }
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  console.log('ProjektContainer')

  const data = {
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
    ...dataIdealbiotops,
    ...dataAparts,
    ...dataAssozarts,
    ...dataEkfzaehleinheits,
    ...dataBeobNichtBeurteilts,
    ...dataBeobNichtZuzuordnens,
    ...dataPopForMap,
    ...dataTpopForMap,
    ...dataBeobZugeordnetForMap,
    ...dataBeobNichtBeurteiltForMap,
    ...dataBeobNichtZuzuordnenForMap,
    ...dataBeobZugeordnetAssignPolylinesForMap,
    ...dataBeobAssignLines,
  }
  // TODO: useMemo?
  const nodes = buildNodes({
    data,
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
    dataPopForMap,
    dataTpopForMap,
    dataBeobZugeordnetForMap,
    dataBeobNichtBeurteiltForMap,
    dataBeobNichtZuzuordnenForMap,
    dataBeobZugeordnetAssignPolylinesForMap,
    dataBeobAssignLines,
    mobxStore,
  })
  console.log('ProjektContainer', { data, dataAdresses })
  setNodes(nodes)
  // remove 2 to treat all same
  const tabs = [...tabsPassed].map(t => t.replace('2', ''))
  const treeFlex =
    projekteTabs.length === 2 && tabs.length === 2
      ? 0.33
      : tabs.length === 0
      ? 1
      : 1 / tabs.length

  // TODO:
  // only fetch these if layer is active
  const popForMapProj = get(dataPopForMap, `popForMap.apsByProjId.nodes`, [])
  const popForMapNodes = flatten(
    popForMapProj.map(n => get(n, 'popsByApId.nodes', [])),
  )
  const mapPopIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: popForMapNodes,
        idKey: 'id',
        xKey: 'x',
        yKey: 'y',
      }),
    [mapFilter, popForMapNodes],
  )
  setPopIdsFiltered(mapPopIdsFiltered)

  const tpopForMapProj = get(dataTpopForMap, `tpopForMap.apsByProjId.nodes`, [])
  const popForTpopForMapNodes = flatten(
    tpopForMapProj.map(n => get(n, 'popsByApId.nodes', [])),
  )
  const tpopForMapNodes = flatten(
    popForTpopForMapNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
  )
  const mapTpopIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: tpopForMapNodes,
      }),
    [mapFilter, tpopForMapNodes],
  )
  setTpopIdsFiltered(mapTpopIdsFiltered)

  const beobNichtBeurteiltForMapAparts = get(
    data,
    `beobNichtBeurteiltForMap.apsByProjId.nodes[0].apartsByApId.nodes`,
    [],
  )
  const beobNichtBeurteiltForMapNodes = flatten(
    beobNichtBeurteiltForMapAparts.map(n =>
      get(n, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
    ),
  )
  const mapBeobNichtBeurteiltIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: beobNichtBeurteiltForMapNodes,
      }),
    [mapFilter, beobNichtBeurteiltForMapNodes],
  )
  setBeobNichtBeurteiltIdsFiltered(mapBeobNichtBeurteiltIdsFiltered)

  const beobNichtZuzuordnenForMapNodesAparts = get(
    data,
    `beobNichtZuzuordnenForMap.apsByProjId.nodes[0].apartsByApId.nodes`,
    [],
  )
  const beobNichtZuzuordnenForMapNodes = flatten(
    beobNichtZuzuordnenForMapNodesAparts.map(n =>
      get(n, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
    ),
  )
  const mapBeobNichtZuzuordnenIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: beobNichtZuzuordnenForMapNodes,
      }),
    [mapFilter, beobNichtZuzuordnenForMapNodes],
  )
  setBeobNichtZuzuordnenIdsFiltered(mapBeobNichtZuzuordnenIdsFiltered)

  const beobZugeordnetForMapAparts = get(
    data,
    `beobZugeordnetForMap.apsByProjId.nodes[0].apartsByApId.nodes`,
    [],
  )
  const beobZugeordnetForMapNodes = flatten(
    beobZugeordnetForMapAparts.map(n =>
      get(n, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
    ),
  )
  const mapBeobZugeordnetIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: beobZugeordnetForMapNodes,
      }),
    [mapFilter, beobZugeordnetForMapNodes],
  )
  setBeobZugeordnetIdsFiltered(mapBeobZugeordnetIdsFiltered)

  if (!activeApfloraLayers.includes('mapFilter')) {
    // when no map filter exists nodes in activeNodeArray should be highlighted
    setIdsFiltered(getSnapshot(activeNodeArray))
  } else {
    // when map filter exists, nodes in map filter should be highlighted
    setIdsFiltered([
      ...mapPopIdsFiltered,
      ...mapTpopIdsFiltered,
      ...mapBeobNichtBeurteiltIdsFiltered,
      ...mapBeobNichtZuzuordnenIdsFiltered,
      ...mapBeobZugeordnetIdsFiltered,
    ])
  }

  const aparts = get(
    data,
    'projektById.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = flatten(
    aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])),
  )

  // TODO: which query to check for error?
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
    console.log('ProjektContainer:', { error, queryErrorArray })
    return <ErrorContainer>{`Fehler: ${error.message}`}</ErrorContainer>
  }

  if (isPrint) {
    return <Daten treeName={treeName} refetchTree={refetch} role={role} />
  }

  return (
    <Container data-loading={loading}>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          {tabs.includes('tree') && (
            <ReflexElement flex={treeFlex}>
              <TreeContainer
                treeName={treeName}
                data={data}
                loading={loading}
                refetchTree={refetch}
              />
            </ReflexElement>
          )}
          {tabs.includes('tree') && tabs.includes('daten') && (
            <ReflexSplitter />
          )}
          {tabs.includes('daten') && (
            <ReflexElement
              propagateDimensions={true}
              renderOnResizeRate={100}
              renderOnResize={true}
            >
              <Daten treeName={treeName} refetchTree={refetch} role={role} />
            </ReflexElement>
          )}
          {tabs.includes('karte') &&
            (tabs.includes('tree') || tabs.includes('daten')) && (
              <ReflexSplitter />
            )}
          {tabs.includes('karte') && (
            <ReflexElement
              className="karte"
              propagateDimensions={true}
              renderOnResizeRate={200}
              renderOnResize={true}
            >
              <Karte
                treeName={treeName}
                data={data}
                refetchTree={refetch}
                loading={loading}
                // SortedStrings enforce rerendering when sorting or visibility changes
                //activeOverlaysString={activeOverlays.join()}
                activeApfloraLayersString={activeApfloraLayers.join()}
                beobsString={beobs.toString()}
              />
            </ReflexElement>
          )}
          {tabs.includes('exporte') &&
            (tabs.includes('tree') ||
              tabs.includes('daten') ||
              tabs.includes('karte')) && <ReflexSplitter />}
          {tabs.includes('exporte') && (
            <ReflexElement>
              <Exporte />
            </ReflexElement>
          )}
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(ProjekteContainer)
