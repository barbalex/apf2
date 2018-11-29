// @flow
import React, { Component } from 'react'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'
import 'leaflet-easyprint'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import FileDownloadIcon from '@material-ui/icons/GetApp'

const StyledButton = styled.button`
  background-color: white;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  cursor: pointer;
  svg {
    margin-left: -2px;
    padding-top: 2px;
    color: rgba(0, 0, 0, 0.7) !important;
  }
`

const enhance = compose(
  withLeaflet,
  withState('printPlugin', 'changePrintPlugin', {}),
  withHandlers({
    savePng: ({ printPlugin }) => event => {
      event.preventDefault()
      printPlugin.printMap('CurrentSize', 'apfloraKarte')
    },
  }),
)

const options = {
  hidden: true,
  position: 'topright',
  // sizeModes may not be needed?
  sizeModes: ['Current'],
  exportOnly: true,
  filename: 'apfloraKarte',
  hideControlContainer: true,
}

class PngControl extends Component {
  constructor(props) {
    super(props)
    // ref is used to try map not to hijack click events
    this.container = React.createRef()
  }

  props: {
    savePng: () => void,
    printPlugin: object,
    changePrintPlugin: () => void,
  }

  componentDidMount() {
    const { leaflet, changePrintPlugin } = this.props
    const pp = window.L.easyPrint(options).addTo(leaflet.map)
    changePrintPlugin(pp)
    /**
     * This was trying to prevent the map from taking over
     * click events
     * see: https://github.com/LiveBy/react-leaflet-control/issues/22
     */
    /*window.L.DomEvent.disableClickPropagation(
      this.container.current,
    ).disableScrollPropagation(this.container.current)*/
  }

  render() {
    const { savePng } = this.props

    return (
      <div ref={this.container}>
        <Control position="topright" ref={this.container}>
          <StyledButton onClick={savePng} title="Karte als png speichern">
            <FileDownloadIcon />
          </StyledButton>
        </Control>
      </div>
    )
  }
}

export default enhance(PngControl)
