import React from 'react'
import 'leaflet'
import { inject, observer } from 'mobx-react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import getContext from 'recompose/getContext'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import PanIcon from 'material-ui/svg-icons/maps/my-location'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import PropTypes from 'prop-types'

import epsg21781to4326 from '../../../modules/epsg21781to4326'
import panCentreIcon from '../../../etc/panTo.png'

const theme = Object.assign({}, baseTheme)

/**
 * TODO:
 * onClick coordinates container: render coordinate-field-pair and go-to button
 * onBlur coordinate-field-pair-container: render coordinates
 * onBlur coordinate field: validate coordinates
 * onClick go-to button:
 * - do nothing if coordinates are invalid, else:
 * - move to coordinates
 * - render coordinates
 */

const CoordinatesControl = styled(Control)`
  margin-bottom: 2px !important;
  margin-right: 5px !important;
  cursor: pointer !important;
`
const StyledDiv = styled.div`
  background-color: transparent;
  color: rgb(48, 48, 48);
  font-weight: 700;
  text-shadow: 0 1px 0 white, -0 -1px 0 white, 1px 0 0 white, -1px 0 0 white,
    0 2px 1px white, -0 -2px 1px white, 2px 0 1px white, -2px 0 1px white,
    0 3px 2px white, -0 -3px 2px white, 3px 0 2px white, -3px 0 2px white;
`
const GotoControl = styled(Control)`
  margin-bottom: 2px !important;
  margin-right: 5px !important;
`
const GotoInnerContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 3px;
  padding-left: 5px;
  padding-right: 5px;
`
const GotoButton = styled(FlatButton)`
  min-width: 30px !important;
  margin-top: 5px !important;
`
const GotoTextField = styled(TextField)`
  width: 150px !important;
  padding: 0 5px;
`

const xIsValid = (x: number) => !x || (x > 470000 && x < 850000)
const yIsValid = (y: number) => !y || (y > 62000 && y < 320000)

const enhance = compose(
  inject('store'),
  withState('controlType', 'changeControlType', 'coordinates'),
  withState('x', 'changeX', ''),
  withState('y', 'changeY', ''),
  withState('xError', 'changeXError', ''),
  withState('yError', 'changeYError', ''),
  // on dealing with focus of div with children, see:
  // https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
  withState('timeoutId', 'changeTimeoutId', ''),
  withState('gotoFocused', 'changeGotoFocused', false),
  getContext({ map: PropTypes.object.isRequired }),
  withState('panToMarker', 'changePanToMarker', null),
  withHandlers({
    onClickCoordinates: props => () => props.changeControlType('goto'),
    onFocusGotoContainer: props => () => {
      const { timeoutId, gotoFocused, changeGotoFocused } = props
      clearTimeout(timeoutId)
      if (!gotoFocused) {
        changeGotoFocused(true)
      }
    },
    onClickClear: props => () => {
      const { panToMarker, map, changeX, changeY } = props
      if (panToMarker) {
        map.removeLayer(panToMarker)
        changeX('')
        changeY('')
      }
    },
    onBlurGotoContainer: props => () => {
      const {
        changeTimeoutId,
        gotoFocused,
        changeGotoFocused,
        changeControlType,
      } = props
      const timeoutId = setTimeout(() => {
        if (gotoFocused) {
          changeGotoFocused(false)
          changeControlType('coordinates')
        }
      })
      changeTimeoutId(timeoutId)
    },
    /**
     * for unknown reason
     * onClickGoto happens TWICE
     * which means marker passed first time
     * is added to the map
     * but marker passed second time is saved in state...
     */
    onClickGoto: props => () => {
      const {
        x,
        y,
        xError,
        yError,
        map,
        changePanToMarker,
        panToMarker,
      } = props
      if (x && y && !xError && !yError) {
        const my4326 = epsg21781to4326(x, y)
        const latLng = new window.L.LatLng(...my4326)
        map.flyTo(latLng)
        const marker = window.L.marker(latLng, {
          title: `${x}/${y}`,
          icon: window.L.icon({
            iconUrl: panCentreIcon,
            iconSize: [36, 36],
          }),
        })
        if (!panToMarker) {
          marker.addTo(map)
          changePanToMarker(marker)
        }
      }
    },
    onChangeX: props => event => {
      let { value } = event.target
      // convert string to number
      value = value ? +value : value
      const { changeX, changeXError } = props
      changeX(value)
      // immediately cancel possible existing error
      if (xIsValid(value)) changeXError('')
    },
    onChangeY: props => event => {
      const { changeY, changeYError } = props
      let { value } = event.target
      // convert string to number
      value = value ? +value : value
      changeY(value)
      // immediately cancel possible existing error
      if (yIsValid(value)) changeYError('')
    },
    onBlurX: props => () => {
      const { x, changeXError } = props
      if (xIsValid(x)) {
        changeXError('')
      } else {
        changeXError(`x muss zwischen 470'000 und 850'000 liegen`)
      }
    },
    onBlurY: props => () => {
      const { y, changeYError } = props
      if (yIsValid(y)) {
        changeYError('')
      } else {
        changeYError(`y muss zwischen 62'000 und 320'000 liegen`)
      }
    },
  }),
  observer
)

const MyControl = ({
  store,
  controlType,
  onClickCoordinates,
  onClickGoto,
  x,
  y,
  onChangeX,
  onChangeY,
  xError,
  yError,
  onBlurX,
  onBlurY,
  onBlurGotoContainer,
  onFocusGotoContainer,
  panToMarker,
  onClickClear,
}: {
  store: Object,
  controlType: string,
  onClickCoordinates: () => void,
  onClickGoto: () => void,
  x: number,
  y: number,
  onChangeX: () => void,
  onChangeY: () => void,
  xError: string,
  yError: string,
  onBlurX: () => void,
  onBlurY: () => void,
  onBlurGotoContainer: () => void,
  onFocusGotoContainer: () => void,
  panToMarker: Object,
  onClickClear: () => void,
}) => {
  if (controlType === 'coordinates') {
    let [x, y] = store.map.mouseCoordEpsg21781
    let coord = ''
    if (x && y) {
      x = parseInt(x, 10).toLocaleString('de-ch')
      y = parseInt(y, 10).toLocaleString('de-ch')
      coord = `${x}, ${y}`
    }
    return (
      <CoordinatesControl position="bottomright">
        <StyledDiv onClick={onClickCoordinates}>{coord}</StyledDiv>
      </CoordinatesControl>
    )
  }
  return (
    <GotoControl position="bottomright">
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <GotoInnerContainer
          onBlur={onBlurGotoContainer}
          onFocus={onFocusGotoContainer}
        >
          <GotoTextField
            type="number"
            min="470000"
            max="850000"
            value={x}
            onChange={onChangeX}
            onBlur={onBlurX}
            hintText="X-Koordinate"
            errorText={xError}
          />
          <GotoTextField
            type="number"
            min="62000"
            max="320000"
            value={y}
            onChange={onChangeY}
            onBlur={onBlurY}
            hintText="Y-Koordinate"
            errorText={yError}
          />
          <GotoButton
            title="auf Koordinaten zentrieren"
            icon={<PanIcon />}
            onClick={onClickGoto}
            disabled={!(x && y && xIsValid(x) && yIsValid(y))}
          />
          <GotoButton
            title="Markierung und Koordinaten entfernen"
            icon={<ClearIcon />}
            onClick={onClickClear}
            disabled={!panToMarker}
          />
        </GotoInnerContainer>
      </MuiThemeProvider>
    </GotoControl>
  )
}

export default enhance(MyControl)
