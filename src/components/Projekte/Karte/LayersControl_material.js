/**
 * this does not work:
 * the card does not expand
 * maybe onTouchTap does not work in map?
 */

import React, { PropTypes } from 'react'
import Control from 'react-leaflet-control'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import { Card, CardHeader, CardText } from 'material-ui/Card'

const theme = Object.assign({}, darkBaseTheme, {
  appBar: {
    height: 51,
  },
})

const enhance = compose(
  inject(`store`),
  withState(`baseLayersExpanded`, `toggleBaseLayersExpanded`, false),
  withState(`overlaysExpanded`, `toggleOverlaysExpanded`, false),
  observer
)

const LayersControl = ({
  store,
  baseLayersExpanded,
  overlaysExpanded,
  toggleBaseLayersExpanded,
  toggleOverlaysExpanded,
}) => {
  return (
    <Control position="topright" >
      <MuiThemeProvider
        muiTheme={getMuiTheme(theme)}
      >
        <div>
          <Card
            expanded={baseLayersExpanded}
            onExpandChange={() => {
              console.log(`expand change`)
              toggleBaseLayersExpanded(!baseLayersExpanded)
            }}
          >
            <CardHeader
              title="Hintergrund"
              actAsExpander
              showExpandableButton
            />
            <CardText expandable>
              base layers
            </CardText>
          </Card>
          <Card
            expanded={overlaysExpanded}
            onExpandChange={() => {
              console.log(`expand change`)
              toggleOverlaysExpanded(!overlaysExpanded)
            }}
          >
            <CardHeader
              title="Überlagerungen"
              actAsExpander
              showExpandableButton
            />
            <CardText expandable>
              overlayed layers
            </CardText>
          </Card>
        </div>
      </MuiThemeProvider>
    </Control>
  )
}

LayersControl.propTypes = {
  store: PropTypes.object.isRequired,
  baseLayersExpanded: PropTypes.bool.isRequired,
  overlaysExpanded: PropTypes.bool.isRequired,
  toggleBaseLayersExpanded: PropTypes.func.isRequired,
  toggleOverlaysExpanded: PropTypes.func.isRequired,
}

export default enhance(LayersControl)
