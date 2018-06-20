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
import { Subscribe } from 'unstated'
import Button from '@material-ui/core/Button'
import jwtDecode from 'jwt-decode'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from '../Karte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import TreeContainer from '../TreeContainer'
import Daten from '../Daten'
import Exporte from '../Exporte'
import getActiveNodes from '../../../modules/getActiveNodes'
import variables from './variables'
import buildNodes from '../TreeContainer/nodes'
import Deletions from './Deletions'
import apfloraLayers from '../Karte/apfloraLayers'
import overlays from '../Karte/overlays'
import idsInsideFeatureCollection from '../../../modules/idsInsideFeatureCollection'
import ErrorState from '../../../state/Error'
import logout from '../../../modules/logout'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
`
const ErrorContainer = styled.div`
  padding: 15px;
`
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`

const enhance = compose(
  withState('apfloraLayers', 'setApfloraLayers', apfloraLayers),
  withState('activeApfloraLayers', 'setActiveApfloraLayers', []),
  withState('overlays', 'setOverlays', overlays),
  withState('activeOverlays', 'setActiveOverlays', []),
  withState('activeBaseLayer', 'setActiveBaseLayer', 'OsmColor'),
  withState('popLabelUsingNr', 'setPopLabelUsingNr', true),
  withState('tpopLabelUsingNr', 'setTpopLabelUsingNr', true),
  withState('idOfTpopBeingLocalized', 'setIdOfTpopBeingLocalized', null),
  withState('tpopLabelUsingNr', 'setTpopLabelUsingNr', true),
  withState('popLabelUsingNr', 'setPopLabelUsingNr', true),
  withState('bounds', 'setBounds', [[47.159, 8.354], [47.696, 8.984]]),
  withState('mapFilter', 'setMapFilter', { features: [], type: 'FeatureCollection' }),
  withState('detailplaene', 'setDetailplaene', null),
  withState('markierungen', 'setMarkierungen', null),
  withState('ktZh', 'setKtZh', null),
)

const ProjekteContainer = ({
  treeName,
  tabs: tabsPassed,
  projekteTabs,
  showDeletions,
  setShowDeletions,
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
}: {
  treeName: String,
  tabs: Array<String>,
  projekteTabs: Array<String>,
  showDeletions: Boolean,
  setShowDeletions: () => void,
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
}) =>
  <Subscribe to={[ErrorState]}>
    {errorState =>
      <Query query={data1Gql} >
        {({ error, data: data1 }) => {
          if (error) return `Fehler: ${error.message}`
          const activeNodeArray = get(data1, `${treeName}.activeNodeArray`)
          const activeNodes = getActiveNodes(activeNodeArray)
          const moving = get(data1, 'moving')
          const copying = get(data1, 'copying')
          const token = get(data1, 'user.token')
          const tokenDecoded = token ? jwtDecode(token) : null
          const role = tokenDecoded ? tokenDecoded.role : null
          console.log({tokenDecoded,role})
          const projekteTabs = [...get(data1, 'urlQuery.projekteTabs', [])]

          /**
           * get data based on openNodes, not activeNodes
           * reason: multiple open nodes should recieve own data
           */

          return (
            <Query query={data2Gql} variables={variables(data1, treeName)}>
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

                const data = merge(data1, data2)
                const nodes = buildNodes({ data, treeName, loading, role })
                const tree = get(data, treeName)
                const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
                const activeNode = nodes.find(n => isEqual(n.url, activeNodeArray))
                // remove 2 to treat all same
                const tabs = [...tabsPassed].map(t => t.replace('2', ''))
                const treeFlex = (projekteTabs.length === 2 && tabs.length === 2) ?
                                  0.33 :
                                    tabs.length === 0 ?
                                    1 :
                                      (1 / tabs.length)
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
                  pops.map(n => get(n, 'tpopsByPopId.nodes'))
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
                const aparts = get(data, 'projektById.apsByProjId.nodes[0].apartsByApId.nodes', [])
                const beobs = flatten(aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])))

                return (
                  <Container data-loading={loading}>
                    <ErrorBoundary>
                      <ReflexContainer orientation="vertical">
                        { 
                          tabs.includes('tree') &&
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
                        }
                        {
                          tabs.includes('tree') && tabs.includes('daten') &&
                          <ReflexSplitter />
                        }
                        {
                          tabs.includes('daten') &&
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
                            />
                          </ReflexElement>
                        }
                        {
                          tabs.includes('karte') &&
                          (tabs.includes('tree') || tabs.includes('daten')) &&
                          <ReflexSplitter />
                        }
                        {
                          tabs.includes('karte') &&
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
                              mapBeobNichtBeurteiltIdsFiltered={mapBeobNichtBeurteiltIdsFiltered}
                              mapBeobNichtZuzuordnenIdsFiltered={mapBeobNichtZuzuordnenIdsFiltered}
                              mapBeobZugeordnetIdsFiltered={mapBeobZugeordnetIdsFiltered}
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
                        }
                        {
                          tabs.includes('exporte') && (tabs.includes('tree') || tabs.includes('daten') || tabs.includes('karte')) &&
                          <ReflexSplitter />
                        }
                        {
                          tabs.includes('exporte') &&
                          <ReflexElement>
                            <Exporte mapFilter={mapFilter} />
                          </ReflexElement>
                        }
                      </ReflexContainer>
                    </ErrorBoundary>
                    {
                      showDeletions &&
                      <Deletions
                        showDeletions={showDeletions}
                        setShowDeletions={setShowDeletions}
                        tree={tree}
                        refetchTree={refetch}
                      />
                    }
                  </Container>
                )
              }}
            </Query>
          )
        }}
      </Query>
    }
  </Subscribe>

export default enhance(ProjekteContainer)
