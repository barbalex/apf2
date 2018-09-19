// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import flatten from 'lodash/flatten'
import Button from '@material-ui/core/Button'
import jwtDecode from 'jwt-decode'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from '../Karte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import withLocalData from './withLocalData'
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
import data2Gql from './data2.graphql'
import TreeContainer from '../TreeContainer'
import Daten from '../Daten'
import Exporte from '../Exporte'
import getActiveNodes from '../../../modules/getActiveNodes'
import buildVariables from './variables'
import buildNodes from '../TreeContainer/nodes'
import apfloraLayers from '../Karte/apfloraLayers'
import overlays from '../Karte/overlays'
import idsInsideFeatureCollection from '../../../modules/idsInsideFeatureCollection'
import withErrorState from '../../../state/withErrorState'
import logout from '../../../modules/logout'
import withTreeNodeFilterState from '../../../state/withNodeFilter'

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
  withLocalData,
  withTreeNodeFilterState,
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
  withErrorState,
  withState('apfloraLayers', 'setApfloraLayers', apfloraLayers),
  withState('activeApfloraLayers', 'setActiveApfloraLayers', []),
  withState('overlays', 'setOverlays', overlays),
  withState('activeOverlays', 'setActiveOverlays', []),
  withState('activeBaseLayer', 'setActiveBaseLayer', 'OsmColor'),
  withState('popLabelUsingNr', 'setPopLabelUsingNr', true),
  withState('tpopLabelUsingNr', 'setTpopLabelUsingNr', true),
  withState('idOfTpopBeingLocalized', 'setIdOfTpopBeingLocalized', null),
  withState('bounds', 'setBounds', [[47.159, 8.354], [47.696, 8.984]]),
  withState('mapFilter', 'setMapFilter', {
    features: [],
    type: 'FeatureCollection',
  }),
  withState('detailplaene', 'setDetailplaene', null),
  withState('markierungen', 'setMarkierungen', null),
  withState('ktZh', 'setKtZh', null),
)

const ProjekteContainer = ({
  dataLocal,
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
  treeName,
  tabs: tabsPassed,
  projekteTabs,
  apfloraLayers,
  setApfloraLayers,
  activeApfloraLayers,
  setActiveApfloraLayers,
  overlays,
  setOverlays,
  activeOverlays,
  setActiveOverlays,
  activeBaseLayer,
  setActiveBaseLayer,
  idOfTpopBeingLocalized,
  setIdOfTpopBeingLocalized,
  tpopLabelUsingNr,
  setTpopLabelUsingNr,
  popLabelUsingNr,
  setPopLabelUsingNr,
  bounds,
  setBounds,
  mapFilter,
  setMapFilter,
  detailplaene,
  setDetailplaene,
  ktZh,
  setKtZh,
  markierungen,
  setMarkierungen,
  errorState,
  nodeFilterState,
}: {
  dataLocal: Object,
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
  treeName: String,
  tabs: Array<String>,
  projekteTabs: Array<String>,
  apfloraLayers: Array<Object>,
  setApfloraLayers: () => void,
  activeApfloraLayers: Array<Object>,
  setActiveApfloraLayers: () => void,
  overlays: Array<Object>,
  setActiveOverlays: () => void,
  activeOverlays: Array<String>,
  setActiveOverlays: () => void,
  activeBaseLayer: String,
  setActiveBaseLayer: () => void,
  idOfTpopBeingLocalized: String,
  setIdOfTpopBeingLocalized: () => void,
  tpopLabelUsingNr: Boolean,
  setTpopLabelUsingNr: () => void,
  popLabelUsingNr: Boolean,
  setPopLabelUsingNr: () => void,
  bounds: Array<Array<Number>>,
  setBounds: () => void,
  mapFilter: Object,
  setMapFilter: () => void,
  detailplaene: Object,
  setDetailplaene: () => void,
  ktZh: Object,
  setKtZh: () => void,
  markierungen: Object,
  setMarkierungen: () => void,
  errorState: Object,
  nodeFilterState: Object,
}) => {
  const activeNodeArray = get(dataLocal, `${treeName}.activeNodeArray`)
  const activeNodes = getActiveNodes(activeNodeArray)
  const openNodes = get(dataLocal, `${treeName}.openNodes`)
  const moving = get(dataLocal, 'moving')
  const copying = get(dataLocal, 'copying')
  const token = get(dataLocal, 'user.token')
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const variables = buildVariables({
    data: dataLocal,
    treeName,
    nodeFilter: nodeFilterState.state[treeName],
  })

  return (
    <Query query={data2Gql} variables={variables}>
      {({ loading, error, data: data2, client, refetch }) => {
        if (error) {
          console.log('ProjektContainer, error:', error.message)
          if (
            error.message.includes('permission denied') ||
            error.message.includes('keine Berechtigung')
          ) {
            console.log('ProjektContainer, token:', token)
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
                    logout()
                  }}
                >
                  Neu anmelden
                </LogoutButton>
              </ErrorContainer>
            )
          }
          return `Fehler: ${error.message}`
        }
        //console.log('ProjektContainer rendered', { dataLocal })

        const data = merge(
          dataLocal,
          data2,
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
        )
        const nodes = buildNodes({
          data,
          treeName,
          loading,
          role,
          nodeFilterState,
        })
        const tree = get(data, treeName)
        const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
        const activeNode = nodes.find(n => isEqual(n.url, activeNodeArray))
        // remove 2 to treat all same
        const tabs = [...tabsPassed].map(t => t.replace('2', ''))
        const treeFlex =
          projekteTabs.length === 2 && tabs.length === 2
            ? 0.33
            : tabs.length === 0
              ? 1
              : 1 / tabs.length
        const assigning = get(data, 'assigningBeob')
        const mapPopIdsFiltered = idsInsideFeatureCollection({
          mapFilter,
          data: get(data, `popForMap.nodes`, []),
          idKey: 'id',
          xKey: 'x',
          yKey: 'y',
        })
        const pops = get(data, 'popForMap.nodes', [])
        const mapTpopsData = flatten(
          pops.map(n => get(n, 'tpopsByPopId.nodes', [])),
        )
        const mapTpopIdsFiltered = idsInsideFeatureCollection({
          mapFilter,
          data: mapTpopsData,
        })
        const mapBeobNichtBeurteiltIdsFiltered = idsInsideFeatureCollection({
          mapFilter,
          data: get(data, `beobNichtBeurteiltForMap.nodes`, []),
        })
        const mapBeobNichtZuzuordnenIdsFiltered = idsInsideFeatureCollection({
          mapFilter,
          data: get(data, `beobNichtZuzuordnenForMap.nodes`, []),
        })
        const mapBeobZugeordnetIdsFiltered = idsInsideFeatureCollection({
          mapFilter,
          data: get(data, `beobZugeordnetForMap.nodes`, []),
        })
        // when no map filter exists nodes in activeNodeArray should be highlighted
        let mapIdsFiltered = activeNodeArray
        if (activeApfloraLayers.includes('mapFilter')) {
          // when map filter exists, nodes in map filter should be highlighted
          mapIdsFiltered = [
            ...mapPopIdsFiltered,
            ...mapTpopIdsFiltered,
            ...mapBeobNichtBeurteiltIdsFiltered,
            ...mapBeobNichtZuzuordnenIdsFiltered,
            ...mapBeobZugeordnetIdsFiltered,
          ]
        }
        const aparts = get(
          data,
          'projektById.apsByProjId.nodes[0].apartsByApId.nodes',
          [],
        )
        const beobs = flatten(
          aparts.map(a =>
            get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
          ),
        )
        const isPrint = get(data, 'isPrint')

        if (isPrint)
          return (
            <Daten
              tree={tree}
              treeName={treeName}
              activeNode={activeNode}
              activeNodes={activeNodes}
              refetchTree={refetch}
              ktZh={ktZh}
              setKtZh={setKtZh}
              role={role}
            />
          )

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
                      activeNodes={activeNodes}
                      activeNode={activeNode}
                      client={client}
                      loading={loading}
                      moving={moving}
                      openNodes={openNodes}
                      copying={copying}
                      activeApfloraLayers={activeApfloraLayers}
                      setActiveApfloraLayers={setActiveApfloraLayers}
                      activeOverlays={activeOverlays}
                      setActiveOverlays={setActiveOverlays}
                      refetchTree={refetch}
                      setIdOfTpopBeingLocalized={setIdOfTpopBeingLocalized}
                      tpopLabelUsingNr={tpopLabelUsingNr}
                      popLabelUsingNr={popLabelUsingNr}
                      setTpopLabelUsingNr={setTpopLabelUsingNr}
                      setPopLabelUsingNr={setPopLabelUsingNr}
                      mapFilter={mapFilter}
                      mapIdsFiltered={mapIdsFiltered}
                    />
                  </ReflexElement>
                )}
                {tabs.includes('tree') &&
                  tabs.includes('daten') && <ReflexSplitter />}
                {tabs.includes('daten') && (
                  <ReflexElement
                    propagateDimensions={true}
                    renderOnResizeRate={100}
                    renderOnResize={true}
                  >
                    <Daten
                      tree={tree}
                      treeName={treeName}
                      activeNode={activeNode}
                      activeNodes={activeNodes}
                      refetchTree={refetch}
                      ktZh={ktZh}
                      setKtZh={setKtZh}
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
                      /**
                       * key of tabs is added to force mounting
                       * when tabs change
                       * without remounting grey space remains
                       * when daten or tree tab is removed :-(
                       */
                      tree={tree}
                      data={data}
                      activeBaseLayer={activeBaseLayer}
                      setActiveBaseLayer={setActiveBaseLayer}
                      apfloraLayers={apfloraLayers}
                      setApfloraLayers={setApfloraLayers}
                      activeApfloraLayers={activeApfloraLayers}
                      setActiveApfloraLayers={setActiveApfloraLayers}
                      overlays={overlays}
                      setOverlays={setOverlays}
                      activeOverlays={activeOverlays}
                      setActiveOverlays={setActiveOverlays}
                      client={client}
                      activeNodes={activeNodes}
                      key={tabs.toString()}
                      refetchTree={refetch}
                      mapIdsFiltered={mapIdsFiltered}
                      mapPopIdsFiltered={mapPopIdsFiltered}
                      mapTpopIdsFiltered={mapTpopIdsFiltered}
                      mapBeobNichtBeurteiltIdsFiltered={
                        mapBeobNichtBeurteiltIdsFiltered
                      }
                      mapBeobNichtZuzuordnenIdsFiltered={
                        mapBeobNichtZuzuordnenIdsFiltered
                      }
                      mapBeobZugeordnetIdsFiltered={
                        mapBeobZugeordnetIdsFiltered
                      }
                      beobZugeordnetAssigning={assigning}
                      idOfTpopBeingLocalized={idOfTpopBeingLocalized}
                      setIdOfTpopBeingLocalized={setIdOfTpopBeingLocalized}
                      tpopLabelUsingNr={tpopLabelUsingNr}
                      popLabelUsingNr={popLabelUsingNr}
                      bounds={bounds}
                      setBounds={setBounds}
                      mapFilter={mapFilter}
                      setMapFilter={setMapFilter}
                      errorState={errorState}
                      // SortedStrings enforce rerendering when sorting or visibility changes
                      activeOverlaysString={activeOverlays.join()}
                      activeApfloraLayersString={activeApfloraLayers.join()}
                      detailplaene={detailplaene}
                      setDetailplaene={setDetailplaene}
                      markierungen={markierungen}
                      setMarkierungen={setMarkierungen}
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
      }}
    </Query>
  )
}

export default enhance(ProjekteContainer)
