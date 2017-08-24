import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'leaflet'
import 'leaflet-easyprint'
import Control from 'react-leaflet-control'
import FontIcon from 'material-ui/FontIcon'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import getContext from 'recompose/getContext'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const StyledButton = styled.button`
  background-color: white;
  width: 47px;
  height: 47px;
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  span {
    color: rgba(0, 0, 0, 0.54) !important;
  }
`

const theme = Object.assign({}, darkBaseTheme, {
  appBar: {
    height: 51,
  },
})

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
  withState('printPlugin', 'changePrintPlugin', {}),
  withHandlers({
    savePng: props => () => {
      const { printPlugin } = props
      printPlugin.printMap('CurrentSize', 'apfloraKarte')
    },
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
        <StyledButton onClick={savePng} title="Karte als png speichern">
          <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
            <FontIcon id="karteAlsPngSpeichern" className="material-icons">
              file_download
            </FontIcon>
          </MuiThemeProvider>
        </StyledButton>
      </Control>
    )
  }
}

export default enhance(PrintControl)
