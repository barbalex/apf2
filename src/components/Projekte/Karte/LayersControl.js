import React, { PropTypes } from 'react'
import Control from 'react-leaflet-control'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import FontIcon from 'material-ui/FontIcon'

const theme = Object.assign({}, darkBaseTheme, {
  appBar: {
    height: 51,
  },
})

const CardContainer = styled.div`
  background-color: white;
  background-clip: padding-box;
  border-radius: 5px;
  border: 2px solid rgba(0,0,0,0.2);
`
const Card = styled.div`
  padding-top: 3px;
  border: 1px solid rgba(0,0,0,0.2);
  color: rgb(48, 48, 48);
`
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  cursor: pointer;
  font-weight: bold;
`
const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
`
const StyledFontIcon = styled(FontIcon)`
  font-size: 18px !important;
  color: rgb(48, 48, 48) !important;
`

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
        <CardContainer>
          <Card>
            <CardHeader onClick={() =>
                toggleBaseLayersExpanded(!baseLayersExpanded)
              }
            >
              <div>Hintergrund</div>
              <div>
                <StyledFontIcon className="material-icons">
                  expand_more
                </StyledFontIcon>
              </div>
            </CardHeader>
            {
              baseLayersExpanded &&
              <CardContent>
                base layers
              </CardContent>
            }
          </Card>
          <Card>
            <CardHeader onClick={() =>
                toggleOverlaysExpanded(!overlaysExpanded)
              }
            >
              <div>überlagernd</div>
              <div>
                <StyledFontIcon className="material-icons">
                  expand_more
                </StyledFontIcon>
              </div>
            </CardHeader>
            {
              overlaysExpanded &&
              <CardContent>
                overlayed layers
              </CardContent>
            }
          </Card>
        </CardContainer>
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
