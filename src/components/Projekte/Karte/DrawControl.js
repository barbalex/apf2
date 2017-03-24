import React, { Component, PropTypes } from 'react'
import 'leaflet'
import 'leaflet-draw'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import { inject } from 'mobx-react'

import tpopIdsInsideFeatureCollection from '../../../modules/tpopIdsInsideFeatureCollection'

const enhance = compose(
  inject(`store`),
  getContext({ map: PropTypes.object.isRequired }),
)

class DrawControl extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { map, store } = this.props
    const mapFilterItems = new window.L.FeatureGroup()
    map.addLayer(mapFilterItems)
    const drawControl = new window.L.Control.Draw({
      draw: {
        marker: false,
        polyline: false,
        circle: false,
      },
      edit: {
        featureGroup: mapFilterItems,
      }
    })
    map.addControl(drawControl)

    map.on('draw:created', (e) => {
      mapFilterItems.addLayer(e.layer)
      store.node.updateMapFilter(mapFilterItems)
    })
    map.on('draw:edited', (e) =>
      store.node.updateMapFilter(mapFilterItems)
    )
    map.on('draw:deleted', (e) =>
      store.node.updateMapFilter(mapFilterItems)
    )
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(DrawControl)
