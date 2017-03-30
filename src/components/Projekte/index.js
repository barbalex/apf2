// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import clone from 'lodash/clone'
import styled from 'styled-components'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'

import StrukturbaumContainer from './StrukturbaumContainer'
import DeleteDatasetModal from './DeleteDatasetModal'
import Daten from './Daten'
import Karte from './Karte'
import Exporte from './Exporte'

const Container = styled(({ loading, children, ...rest }) => <div {...rest}>{children}</div>)`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: ${(props) => (props.loading ? `wait` : `inherit`)}
`
const Content = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
`
const KarteContainer = styled.div`
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  flex-basis: 600px;
  flex-grow: 6;
  flex-shrink: 1;
  height: 100%;
`

const enhance = compose(
  inject(`store`),
  lifecycle({
    componentDidMount: function() {
      // console.log(`Projekte did mount`)
    }
  }),
  observer
)

const Projekte = ({ store }) => {
  const projekteTabs = clone(store.urlQuery.projekteTabs) || []
  const strukturbaumIsVisible = projekteTabs.includes(`strukturbaum`)
  const datenIsVisible = projekteTabs.includes(`daten`) && !projekteTabs.includes(`exporte`)
  const karteIsVisible = projekteTabs.includes(`karte`)
  const exporteIsVisible = projekteTabs.includes(`exporte`)
  const deleteDatasetModalIsVisible = !!store.datasetToDelete.id

  return (
    <Container loading={store.loading.length > 0}>
      <Content>
        {
          strukturbaumIsVisible &&
          <StrukturbaumContainer />
        }
        {
          datenIsVisible &&
          <Daten />
        }
        {
          karteIsVisible &&
          <KarteContainer>
            <Karte
              /**
               * key of tabs is added to force mounting
               * when tabs change
               * without remounting grey space remains
               * when daten or strukturbaum tab is removed :-(
               */
              key={store.urlQuery.projekteTabs.toString()}
              popMarkers={store.map.pop.markers}
              popHighlighted={store.map.pop.highlightedIds.join()}
              tpopMarkers={store.map.tpop.markers}
              tpopHighlighted={store.map.tpop.highlightedIds.join()}
              tpopMarkersClustered={store.map.tpop.markersClustered}
              beobNichtBeurteiltMarkers={store.map.beobNichtBeurteilt.markers}
              beobNichtBeurteiltHighlighted={store.map.beobNichtBeurteilt.highlightedIds.join()}
              beobNichtBeurteiltMarkersClustered={store.map.beobNichtBeurteilt.markersClustered}
              beobNichtZuzuordnenMarkers={store.map.beobNichtZuzuordnen.markersClustered}
              beobNichtZuzuordnenHighlighted={store.map.beobNichtZuzuordnen.highlightedIds.join()}
              tpopBeobMarkers={store.map.tpopBeob.markers}
              tpopBeobHighlighted={store.map.tpopBeob.highlightedIds.join()}
              tpopBeobMarkersClustered={store.map.tpopBeob.markersClustered}
              tpopBeobAssigning={store.map.beob.assigning}
              tpopBeobAssignPolylines={store.map.tpopBeob.assignPolylines}
              tpopBeobAssignPolylinesLength={store.map.tpopBeob.assignPolylines.length}
              idOfTpopBeingLocalized={store.map.tpop.idOfTpopBeingLocalized}
              activeBaseLayer={store.map.activeBaseLayer}
              activeOverlays={store.map.activeOverlays}
              activeApfloraLayers={store.map.activeApfloraLayers}
              // SortedStrings enforce rerendering when sorting or visibility changes
              activeOverlaysSortedString={store.map.activeOverlaysSortedString}
              activeApfloraLayersSortedString={store.map.activeApfloraLayersSortedString}
            />
          </KarteContainer>
        }
        {
          exporteIsVisible &&
          <Exporte />
        }
        {
          deleteDatasetModalIsVisible &&
          <DeleteDatasetModal />
        }
      </Content>
    </Container>
  )
}

Projekte.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Projekte)
