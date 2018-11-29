// @flow
import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import get from 'lodash/get'
import upperFirst from 'lodash/upperFirst'
import isEqual from 'lodash/isEqual'
import flatten from 'lodash/flatten'
import Button from '@material-ui/core/Button'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from '../Karte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import withAdresses from './withAdresses'
import withUsers from './withUsers'
import withProjekts from './withProjekts'
import withApberuebersichts from './withApberuebersichts'
import withAps from './withAps'
import withPops from './withPops'
import withPopbers from './withPopbers'
import withPopmassnbers from './withPopmassnbers'
import withTpops from './withTpops'
import withTpopmassns from './withTpopmassns'
import withTpopmassnbers from './withTpopmassnbers'
import withTpopfeldkontrs from './withTpopfeldkontrs'
import withTpopfreiwkontrs from './withTpopfreiwkontrs'
import withTpopkontrzaehls from './withTpopkontrzaehls'
import withTpopbers from './withTpopbers'
import withBeobZugeordnets from './withBeobZugeordnets'
import withZiels from './withZiels'
import withZielbers from './withZielbers'
import withErfkrits from './withErfkrits'
import withApbers from './withApbers'
import withBers from './withBers'
import withIdealbiotops from './withIdealbiotops'
import withAparts from './withAparts'
import withAssozarts from './withAssozarts'
import withEkfzaehleinheits from './withEkfzaehleinheits'
import withBeobNichtBeurteilts from './withBeobNichtBeurteilts'
import withBeobNichtZuzuordnens from './withBeobNichtZuzuordnens'
import withPopForMap from './withPopForMap'
import withTpopForMap from './withTpopForMap'
import withBeobNichtBeurteiltForMap from './withBeobNichtBeurteiltForMap'
import withBeobNichtZuzuordnenForMap from './withBeobNichtZuzuordnenForMap'
import withBeobZugeordnetForMap from './withBeobZugeordnetForMap'
import withBeobZugeordnetForMapMarkers from './withBeobZugeordnetForMapMarkers'
import withBeobNichtBeurteiltForMapMarkers from './withBeobNichtBeurteiltForMapMarkers'
import withBeobNichtZuzuordnenForMapMarkers from './withBeobNichtZuzuordnenForMapMarkers'
import withBeobZugeordnetAssignPolylinesForMap from './withBeobZugeordnetAssignPolylinesForMap'
import withBeobAssignLines from './withBeobAssignLines'
import withPopForMapMarkers from './withPopForMapMarkers'
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

const enhance = compose(
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withProps(({ treeName, mobxStore }) =>
    buildVariables({
      treeName,
      mobxStore,
    }),
  ),
  withAdresses,
  withUsers,
  withProjekts,
  withApberuebersichts,
  withAps,
  withPops,
  withPopbers,
  withPopmassnbers,
  withTpops,
  withTpopmassns,
  withTpopmassnbers,
  withTpopfeldkontrs,
  withTpopfreiwkontrs,
  withTpopkontrzaehls,
  withTpopbers,
  withBeobZugeordnets,
  withZiels,
  withZielbers,
  withErfkrits,
  withApbers,
  withBers,
  withIdealbiotops,
  withAparts,
  withAssozarts,
  withEkfzaehleinheits,
  withBeobNichtBeurteilts,
  withBeobNichtZuzuordnens,
  withPopForMap,
  withTpopForMap,
  withBeobNichtBeurteiltForMap,
  withBeobNichtZuzuordnenForMap,
  withBeobZugeordnetForMap,
  withBeobZugeordnetForMapMarkers,
  withBeobNichtBeurteiltForMapMarkers,
  withBeobNichtZuzuordnenForMapMarkers,
  withBeobZugeordnetAssignPolylinesForMap,
  withBeobAssignLines,
  withPopForMapMarkers,
  observer,
)

const ProjekteContainer = props => {
  const {
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
    dataBeobNichtBeurteiltForMap,
    dataBeobNichtZuzuordnenForMap,
    dataBeobZugeordnetForMap,
    dataBeobZugeordnetForMapMarkers,
    dataBeobNichtBeurteiltForMapMarkers,
    dataBeobNichtZuzuordnenForMapMarkers,
    dataBeobZugeordnetAssignPolylinesForMap,
    dataPopForMapMarkers,
    dataBeobAssignLines,
    treeName,
    tabs: tabsPassed,
    projekteTabs,
  }: {
    dataAdresses: Object,
    dataUsers: Object,
    dataProjekts: Object,
    dataApberuebersichts: Object,
    dataAps: Object,
    dataPops: Object,
    dataPopbers: Object,
    dataPopmassnbers: Object,
    dataTpops: Object,
    dataTpopmassns: Object,
    dataTpopmassnbers: Object,
    dataTpopfeldkontrs: Object,
    dataTpopfreiwkontrs: Object,
    dataTpopkontrzaehls: Object,
    dataTpopbers: Object,
    dataBeobZugeordnets: Object,
    dataZiels: Object,
    dataZielbers: Object,
    dataErfkrits: Object,
    dataApbers: Object,
    dataBers: Object,
    dataIdealbiotops: Object,
    dataAparts: Object,
    dataAssozarts: Object,
    dataEkfzaehleinheits: Object,
    dataBeobNichtBeurteilts: Object,
    dataBeobNichtZuzuordnens: Object,
    dataPopForMap: Object,
    dataTpopForMap: Object,
    dataBeobNichtBeurteiltForMap: Object,
    dataBeobNichtZuzuordnenForMap: Object,
    dataBeobZugeordnetForMap: Object,
    dataBeobZugeordnetForMapMarkers: Object,
    dataBeobNichtBeurteiltForMapMarkers: Object,
    dataBeobNichtZuzuordnenForMapMarkers: Object,
    dataBeobZugeordnetAssignPolylinesForMap: Object,
    dataPopForMapMarkers: Object,
    dataBeobAssignLines: Object,
    treeName: String,
    tabs: Array<String>,
    projekteTabs: Array<String>,
  } = props

  const mobxStore = useContext(mobxStoreContext)
  const {
    activeApfloraLayers,
    activeOverlays,
    mapFilter: mapFilterRaw,
    nodeFilter,
    user,
    isPrint,
  } = mobxStore
  const { activeNodeArray, openNodes, map } = mobxStore[treeName]
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

  /*console.log('ProjektContainer, dataTpops', {
    dataTpops,
    activeNodeArray,
    openNodes,
  })*/

  const queryArray = [
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
    dataBeobNichtBeurteiltForMap,
    dataBeobNichtZuzuordnenForMap,
    dataBeobZugeordnetForMap,
    dataBeobZugeordnetForMapMarkers,
    dataBeobNichtBeurteiltForMapMarkers,
    dataBeobNichtZuzuordnenForMapMarkers,
    dataBeobZugeordnetAssignPolylinesForMap,
    dataPopForMapMarkers,
    dataBeobAssignLines,
  ]

  const loading = anyQueryIsLoading(queryArray)

  // TODO:
  const refetch = query => {
    if (query) {
      if (query) {
        if (props[`data${upperFirst(query)}`]) {
          props[`data${upperFirst(query)}`].refetch()
        }
      }
    }
  }
  const { token } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  // TODO: which query to check for error?
  if (anyQueryReturnsPermissionError(queryArray)) {
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
  const error = anyQueryReturnsError(queryArray)
  if (error) {
    console.log('ProjektContainer:', { error, queryArray })
    return <ErrorContainer>`Fehler: ${error.message}`</ErrorContainer>
  }

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
    ...dataBeobNichtBeurteiltForMap,
    ...dataBeobNichtZuzuordnenForMap,
    ...dataBeobZugeordnetForMap,
    ...dataBeobZugeordnetForMapMarkers,
    ...dataBeobNichtBeurteiltForMapMarkers,
    ...dataBeobNichtZuzuordnenForMapMarkers,
    ...dataBeobZugeordnetAssignPolylinesForMap,
    ...dataPopForMapMarkers,
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
    dataBeobNichtBeurteiltForMap,
    dataBeobNichtZuzuordnenForMap,
    dataBeobZugeordnetForMap,
    dataBeobZugeordnetForMapMarkers,
    dataBeobNichtBeurteiltForMapMarkers,
    dataBeobNichtZuzuordnenForMapMarkers,
    dataBeobZugeordnetAssignPolylinesForMap,
    dataPopForMapMarkers,
    dataBeobAssignLines,
    mobxStore,
  })
  const activeNode = nodes.find(n => isEqual(n.url, activeNodeArray))
  // remove 2 to treat all same
  const tabs = [...tabsPassed].map(t => t.replace('2', ''))
  const treeFlex =
    projekteTabs.length === 2 && tabs.length === 2
      ? 0.33
      : tabs.length === 0
      ? 1
      : 1 / tabs.length

  const popForMapNodes = get(data, `popForMap.nodes`, [])
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

  const pops = get(data, 'popForMap.nodes', [])
  const tpopForMapNodes = flatten(
    pops.map(n => get(n, 'tpopsByPopId.nodes', [])),
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

  const beobNichtBeurteiltForMapNodes = get(
    data,
    `beobNichtBeurteiltForMap.nodes`,
    [],
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

  const beobNichtZuzuordnenForMapNodes = get(
    data,
    `beobNichtZuzuordnenForMap.nodes`,
    [],
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

  const beobZugeordnetForMapNodes = get(data, `beobZugeordnetForMap.nodes`, [])
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

  if (isPrint) {
    return (
      <Daten
        treeName={treeName}
        activeNode={activeNode}
        refetchTree={refetch}
        role={role}
      />
    )
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
                nodes={nodes}
                activeNode={activeNode}
                loading={loading}
                openNodes={openNodes}
                refetchTree={refetch}
                mapFilter={mapFilter}
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
              <Daten
                treeName={treeName}
                activeNode={activeNode}
                refetchTree={refetch}
                role={role}
              />
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
                activeOverlaysString={activeOverlays.join()}
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
              <Exporte mapFilter={mapFilter} />
            </ReflexElement>
          )}
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(ProjekteContainer)
