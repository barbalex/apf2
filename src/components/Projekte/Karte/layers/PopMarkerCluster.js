import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import some from 'lodash/some'
import compose from 'recompose/compose'
import 'leaflet'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

import popIcon from '../../../../etc/pop.svg'
import popIconHighlighted from '../../../../etc/popHighlighted.svg'

const enhance = compose(
  inject(`store`),
  observer
)

class PopMarkerCluster extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    map: PropTypes.object.isRequired,
    pops: PropTypes.array.isRequired,
    labelUsingNr: PropTypes.bool.isRequired,
    highlightedIds: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  constructor() {
    super()
    this.addMarkerCluster = this.addMarkerCluster.bind(this)
  }

  static markers = []

  addMarkerCluster() {
    const { map, pops, labelUsingNr, highlightedIds, visible } = this.props
    if (this.markers && this.markers.length > 0) {
      map.removeLayer(this.markers)
    }
    const mcgOptions = {
			maxClusterRadius: 80,
			iconCreateFunction: function (cluster) {
				const markers = cluster.getAllChildMarkers()
        const hasHighlightedPop = some(markers, (m) => m.options.icon.options.className === `popIconHighlighted`)
        const className = hasHighlightedPop ? `popClusterHighlighted` : `popCluster`
				return window.L.divIcon({ html: markers.length, className, iconSize: window.L.point(40, 40) })
			},
		}
    this.markers = window.L.markerClusterGroup(mcgOptions)
    if (visible) {
      pops.forEach((p) => {
        if (p.PopKoordWgs84) {
          let title = labelUsingNr ? p.PopNr : p.PopName
          // beware: leaflet needs title to always be a string
          if (title && title.toString) {
            title = title.toString()
          }
          const isHighlighted = highlightedIds.includes(p.PopId)
          const latLng = new window.L.LatLng(...p.PopKoordWgs84)
          const icon = window.L.icon({
            iconUrl: isHighlighted ? popIconHighlighted : popIcon,
            iconSize: [24, 24],
            className: isHighlighted ? `popIconHighlighted` : `popIcon`,
          })
          const marker = window.L.marker(latLng, {
            title,
            icon,
          }).bindPopup(title)
          this.markers.addLayer(marker)
        }
      })
      map.addLayer(this.markers)
    }
  }

  componentDidMount() {
    this.addMarkerCluster()
  }

  componentDidUpdate() {
    this.addMarkerCluster()
  }

  componentWillUnmount() {
    const { map } = this.props
    map.removeLayer(this.markers)
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(PopMarkerCluster)
