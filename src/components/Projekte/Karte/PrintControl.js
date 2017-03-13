import React, { Component, PropTypes } from 'react'
import 'leaflet'
import 'leaflet-easyprint'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'

const enhance = compose(
  inject(`store`),
  getContext({ map: PropTypes.object }),
  observer
)

class PrintControl extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { map } = this.props
    const options = {
      title: `drucken`,
      position: `topright`,
    }
    window.L.easyPrint(options).addTo(map)
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(PrintControl)
