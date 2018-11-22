import React, { useContext, useState, useCallback } from 'react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../../../../theme'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { observer } from 'mobx-react-lite'

import Overlays from './Overlays'
import ApfloraLayers from './ApfloraLayers'
import BaseLayers from './BaseLayers'
import mobxStoreContext from '../../../../mobxStoreContext'

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

const LayersControl = ({
  data,
  tree,
  activeNodes,
  mapIdsFiltered,
  mapPopIdsFiltered,
  mapTpopIdsFiltered,
  mapBeobNichtBeurteiltIdsFiltered,
  mapBeobNichtZuzuordnenIdsFiltered,
  mapBeobZugeordnetIdsFiltered,
}: {
  data: Object,
  tree: Object,
  activeNodes: Object,
  onToggleBaseLayersExpanded: () => void,
  onToggleOverlaysExpanded: () => void,
  mapIdsFiltered: Array<String>,
  mapPopIdsFiltered: Array<String>,
  mapTpopIdsFiltered: Array<String>,
  mapBeobNichtBeurteiltIdsFiltered: Array<String>,
  mapBeobZugeordnetIdsFiltered: Array<String>,
  mapBeobNichtZuzuordnenIdsFiltered: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { apfloraLayers, overlays } = mobxStore

  const [baseLayersExpanded, toggleBaseLayersExpanded] = useState(false)
  const [overlaysExpanded, toggleOverlaysExpanded] = useState(false)
  const [apfloraLayersExpanded, toggleApfloraLayersExpanded] = useState(false)

  const onToggleBaseLayersExpanded = useCallback(
    event => {
      event.stopPropagation()
      toggleBaseLayersExpanded(!baseLayersExpanded)
      if (overlaysExpanded) {
        toggleOverlaysExpanded(!overlaysExpanded)
      }
      if (apfloraLayersExpanded) {
        toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      }
    },
    [baseLayersExpanded, overlaysExpanded, apfloraLayersExpanded],
  )
  const onToggleOverlaysExpanded = useCallback(
    () => {
      toggleOverlaysExpanded(!overlaysExpanded)
      if (baseLayersExpanded) {
        toggleBaseLayersExpanded(!baseLayersExpanded)
      }
      if (apfloraLayersExpanded) {
        toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      }
    },
    [overlaysExpanded, baseLayersExpanded, apfloraLayersExpanded],
  )
  const onToggleApfloraLayersExpanded = useCallback(
    () => {
      toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      if (overlaysExpanded) {
        toggleOverlaysExpanded(!overlaysExpanded)
      }
      if (baseLayersExpanded) {
        toggleBaseLayersExpanded(!baseLayersExpanded)
      }
    },
    [overlaysExpanded, baseLayersExpanded, apfloraLayersExpanded],
  )

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
                tree={tree}
                activeNodes={activeNodes}
                mapIdsFiltered={mapIdsFiltered}
                mapPopIdsFiltered={mapPopIdsFiltered}
                mapTpopIdsFiltered={mapTpopIdsFiltered}
                mapBeobNichtBeurteiltIdsFiltered={
                  mapBeobNichtBeurteiltIdsFiltered
                }
                mapBeobNichtZuzuordnenIdsFiltered={
                  mapBeobNichtZuzuordnenIdsFiltered
                }
                mapBeobZugeordnetIdsFiltered={mapBeobZugeordnetIdsFiltered}
                /**
                 * overlaysString enforces rererender
                 * even when only the sorting changes
                 */
                apfloraLayersString={apfloraLayers.map(o => o.value).join()}
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
                /**
                 * overlaysString enforces rererender
                 * even when only the sorting changes
                 */
                overlaysString={overlays.map(o => o.value).join()}
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
            {baseLayersExpanded && <BaseLayers />}
          </Card>
        </CardContainer>
      </MuiThemeProvider>
    </Control>
  )
}

export default observer(LayersControl)
