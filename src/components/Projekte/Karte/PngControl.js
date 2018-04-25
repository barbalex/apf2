import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'leaflet'
import 'leaflet-easyprint'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import getContext from 'recompose/getContext'
import { MuiThemeProvider } from 'material-ui/styles'
import FileDownloadIcon from '@material-ui/icons/FileDownload'
import v1Theme from '../../../theme'

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
  getContext({ map: PropTypes.object.isRequired }),
  withState('printPlugin', 'changePrintPlugin', {}),
  withHandlers({
    savePng: ({ printPlugin }) => () =>
      printPlugin.printMap('CurrentSize', 'apfloraKarte'),
  })
)

class PrintControl extends Component {
  props: {
    savePng: () => void,
    printPlugin: object,
    changePrintPlugin: () => void,
  }

  componentDidMount() {
    const { map, changePrintPlugin } = this.props
    const options = {
      hidden: true,
      position: 'topright',
      // sizeModes may not be needed?
      sizeModes: ['Current'],
      exportOnly: true,
      filename: 'apfloraKarte',
      hideControlContainer: true,
    }
    const pp = window.L.easyPrint(options).addTo(map)
    changePrintPlugin(pp)
  }

  render() {
    const { savePng } = this.props

    return (
      <Control position="topright">
        <MuiThemeProvider theme={v1Theme}>
          <StyledButton onClick={savePng} title="Karte als png speichern">
            <FileDownloadIcon />
          </StyledButton>
        </MuiThemeProvider>
      </Control>
    )
  }
}

export default enhance(PrintControl)
