import React, { Component } from 'react'
import 'leaflet'
// eslint-disable-next-line no-unused-vars
import leafletFullscreen from 'leaflet.fullscreen'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import PropTypes from 'prop-types'

const enhance = compose(getContext({ map: PropTypes.object.isRequired }))

class FullScreenControl extends Component {
  componentDidMount() {
    const { map } = this.props

    const options = {
      position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
      title: 'Karte maximieren', // change the title of the button, default Full Screen
      titleCancel: 'Karte verkleinern', // change the title of the button when fullscreen is on, default Exit Full Screen
      content: null, // change the content of the button, can be HTML, default null
      forceSeparateButton: false, // force seperate button to detach from zoom buttons, default false
      forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
      fullscreenElement: false, // Dom element to render in full screen, false by default, fallback to map._container
    }
    const fullscreenControl = window.L.control.fullscreen(options)
    fullscreenControl.addTo(map)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(FullScreenControl)
