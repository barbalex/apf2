import React from 'react'
import Control from 'react-leaflet-control'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../../../../theme'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import get from 'lodash/get'

import Overlays from './Overlays'
import ApfloraLayers from './ApfloraLayers'
import BaseLayers from './BaseLayers'

const CardContainer = styled.div`
  background-color: white;
  background-clip: padding-box;
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.2);
`
const Card = styled.div`
  padding-top: 3px;
  color: rgb(48, 48, 48);
  &:not(:first-of-type) {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
`
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 7px;
  padding-right: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-weight: bold;
  user-select: none;
`
const CardTitle = styled.div`
  padding-right: 5px;
`
const CardTitleApfloraOpen = styled(CardTitle)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70px;
`
const StyledExpandLessIcon = styled(ExpandLessIcon)`
  height: 18px !important;
`
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  height: 18px !important;
`

const enhance = compose(
  inject('store'),
  withState('baseLayersExpanded', 'toggleBaseLayersExpanded', false),
  withState('overlaysExpanded', 'toggleOverlaysExpanded', false),
  withState('apfloraLayersExpanded', 'toggleApfloraLayersExpanded', false),
  withHandlers({
    onToggleBaseLayersExpanded: ({
      overlaysExpanded,
      baseLayersExpanded,
      toggleOverlaysExpanded,
      toggleBaseLayersExpanded,
      toggleApfloraLayersExpanded,
      apfloraLayersExpanded,
    }) => (event) => {
      console.log('hi')
      event.stopPropagation()
      toggleBaseLayersExpanded(!baseLayersExpanded)
      if (overlaysExpanded) {
        toggleOverlaysExpanded(!overlaysExpanded)
      }
      if (apfloraLayersExpanded) {
        toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      }
    },
    onToggleOverlaysExpanded: ({
      overlaysExpanded,
      baseLayersExpanded,
      toggleOverlaysExpanded,
      toggleBaseLayersExpanded,
      toggleApfloraLayersExpanded,
      apfloraLayersExpanded,
    }) => () => {
      toggleOverlaysExpanded(!overlaysExpanded)
      if (baseLayersExpanded) {
        toggleBaseLayersExpanded(!baseLayersExpanded)
      }
      if (apfloraLayersExpanded) {
        toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      }
    },
    onToggleApfloraLayersExpanded: ({
      overlaysExpanded,
      baseLayersExpanded,
      toggleOverlaysExpanded,
      toggleBaseLayersExpanded,
      toggleApfloraLayersExpanded,
      apfloraLayersExpanded,
    }) => () => {
      toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      if (overlaysExpanded) {
        toggleOverlaysExpanded(!overlaysExpanded)
      }
      if (baseLayersExpanded) {
        toggleBaseLayersExpanded(!baseLayersExpanded)
      }
    },
  }),
  observer
)

const LayersControl = ({
  data,
  store,
  tree,
  activeNodes,
  apfloraLayers,
  setApfloraLayers,
  activeApfloraLayers,
  setActiveApfloraLayers,
  baseLayersExpanded,
  overlaysExpanded,
  apfloraLayersExpanded,
  onToggleBaseLayersExpanded,
  onToggleOverlaysExpanded,
  onToggleApfloraLayersExpanded,
  overlays,
  setOverlays,
  activeOverlays,
  setActiveOverlays,
  activeBaseLayer,
  setActiveBaseLayer,
  bounds,
  setBounds,
  popBounds,
  setPopBounds,
  tpopBounds,
  setTpopBounds,
  beobNichtBeurteiltBounds,
  setBeobNichtBeurteiltBounds,
  beobNichtZuzuordnenBounds,
  setBeobNichtZuzuordnenBounds,
  beobZugeordnetBounds,
  setBeobZugeordnetBounds,
}: {
  data: Object,
  store: Object,
  tree: Object,
  activeNodes: Object,
  apfloraLayers: Array<Object>,
  setApfloraLayers: () => void,
  activeApfloraLayers: Array<Object>,
  setActiveApfloraLayers: () => void,
  baseLayersExpanded: boolean,
  overlaysExpanded: boolean,
  toggleBaseLayersExpanded: () => void,
  toggleOverlaysExpanded: () => void,
  onToggleBaseLayersExpanded: () => void,
  onToggleOverlaysExpanded: () => void,
  overlays: Array<Object>,
  setOverlays: () => void,
  activeOverlays: Array<String>,
  setActiveOverlays: () => void,
  activeBaseLayer: String,
  setActiveBaseLayer: () => void,
  bounds: Array<Array<Number>>,
  setBounds: () => void,
  popBounds: Array<Array<Number>>,
  setPopBounds: () => void,
  tpopBounds: Array<Array<Number>>,
  setTpopBounds: () => void,
  beobNichtBeurteiltBounds: Array<Array<Number>>,
  setBeobNichtBeurteiltBounds: () => void,
  beobNichtZuzuordnenBounds: Array<Array<Number>>,
  setBeobNichtZuzuordnenBounds: () => void,
  beobZugeordnetBounds: Array<Array<Number>>,
  setBeobZugeordnetBounds: () => void,
}) => {
  const assigning = get(data, 'assigningBeob')
  const getApfloraLayersTitle = () => {
    if (!activeNodes.ap) return 'apflora'
    const ap = activeNodes.ap
    if (!ap || !ap.label) return 'apflora'
    return ap.label
  }
  const ApfloraCard =
    baseLayersExpanded || apfloraLayersExpanded || overlaysExpanded
      ? CardTitle
      : CardTitleApfloraOpen

  return (
    <Control position="topright">
      <MuiThemeProvider theme={theme}>
        <CardContainer>
          <Card>
            <CardHeader onClick={onToggleApfloraLayersExpanded}>
              <ApfloraCard>{getApfloraLayersTitle()}</ApfloraCard>
              <div>
                {apfloraLayersExpanded ? (
                  <StyledExpandLessIcon />
                ) : (
                  <StyledExpandMoreIcon />
                )}
              </div>
            </CardHeader>
            {apfloraLayersExpanded && (
              <ApfloraLayers
                store={store}
                activeNodes={activeNodes}
                apfloraLayers={apfloraLayers}
                setApfloraLayers={setApfloraLayers}
                activeApfloraLayers={activeApfloraLayers}
                setActiveApfloraLayers={setActiveApfloraLayers}
                bounds={bounds}
                setBounds={setBounds}
                popBounds={popBounds}
                setPopBounds={setPopBounds}
                tpopBounds={tpopBounds}
                setTpopBounds={setTpopBounds}
                beobNichtBeurteiltBounds={beobNichtBeurteiltBounds}
                setBeobNichtBeurteiltBounds={setBeobNichtBeurteiltBounds}
                beobNichtZuzuordnenBounds={beobNichtZuzuordnenBounds}
                setBeobNichtZuzuordnenBounds={setBeobNichtZuzuordnenBounds}
                beobZugeordnetBounds={beobZugeordnetBounds}
                setBeobZugeordnetBounds={setBeobZugeordnetBounds}
                /**
                 * overlaysString enforces rererender
                 * even when only the sorting changes
                 */
                apfloraLayersString={apfloraLayers.map(o => o.value).join()}
                assigning={assigning}
              />
            )}
          </Card>
          <Card>
            <CardHeader onClick={onToggleOverlaysExpanded}>
              <CardTitle>überlagernd</CardTitle>
              <div>
                {overlaysExpanded ? (
                  <StyledExpandLessIcon />
                ) : (
                  <StyledExpandMoreIcon />
                )}
              </div>
            </CardHeader>
            {overlaysExpanded && (
              <Overlays
                store={store}
                overlays={overlays}
                setOverlays={setOverlays}
                activeOverlays={activeOverlays}
                setActiveOverlays={setActiveOverlays}
                /**
                 * overlaysString enforces rererender
                 * even when only the sorting changes
                 */
                overlaysString={overlays.map(o => o.value).join()}
                assigning={assigning}
              />
            )}
          </Card>
          <Card>
            <CardHeader onClick={onToggleBaseLayersExpanded}>
              <CardTitle>Hintergrund</CardTitle>
              <div>
                {baseLayersExpanded ? (
                  <StyledExpandLessIcon />
                ) : (
                  <StyledExpandMoreIcon />
                )}
              </div>
            </CardHeader>
            {
              baseLayersExpanded &&
              <BaseLayers
                activeBaseLayer={activeBaseLayer}
                setActiveBaseLayer={setActiveBaseLayer}
              />
            }
          </Card>
        </CardContainer>
      </MuiThemeProvider>
    </Control>
  )
}

export default enhance(LayersControl)
