import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import 'leaflet'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import PanIcon from '@material-ui/icons/MyLocation'
import ClearIcon from '@material-ui/icons/Clear'

import epsg2056to4326 from '../../../../modules/epsg2056to4326'
import panCentreIcon from '../../../../etc/panTo.png'

const Container = styled.div`
  display: flex;
  background-color: white;
  border-radius: 3px;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 2px !important;
  margin-right: 5px !important;
  max-width: 380px;
`
const StyledIconButton = styled(IconButton)`
  margin-top: 8px !important;
  cursor: ${props => (props.disabled ? 'pointer !important' : 'default')};
`
const StyledPanIcon = styled(PanIcon)`
  color: ${props => (props.disabled ? 'grey !important' : 'unset')};
`
const StyledClearIcon = styled(ClearIcon)`
  color: ${props => (props.disabled ? 'grey !important' : 'unset')};
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const xIsValid = (x: ?number) => !x || (x >= 2485071 && x < 2828516)
const yIsValid = (y: ?number) => !y || (y >= 1075346 && y < 1299942)

const enhance = compose(
  withState('xError', 'changeXError', ''),
  withState('yError', 'changeYError', ''),
  // on dealing with focus of div with children, see:
  // https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
  withState('timeoutId', 'changeTimeoutId', ''),
  withState('gotoFocused', 'changeGotoFocused', false),
  withHandlers({
    onFocusGotoContainer: props => () => {
      const { timeoutId, gotoFocused, changeGotoFocused } = props
      clearTimeout(timeoutId)
      if (!gotoFocused) {
        changeGotoFocused(true)
      }
    },
    onClickClear: props => () => {
      const { map, store, changeControlType } = props
      const {
        changePanToX,
        changePanToY,
        panToMarker,
        changePanToMarker,
      } = store.map
      panToMarker && map.removeLayer(panToMarker)
      changePanToMarker(null)
      changePanToX('')
      changePanToY('')
      changeControlType('coordinates')
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
      const { xError, yError, map, store } = props
      const { panToMarker, changePanToMarker } = store.map
      const { panToX: x, panToY: y } = store.map
      if (x && y && !xError && !yError) {
        const my4326 = epsg2056to4326(x, y)
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
      const { changeXError, store } = props
      store.map.changePanToX(value)
      // immediately cancel possible existing error
      if (xIsValid(value)) changeXError('')
    },
    onChangeY: props => event => {
      const { changeYError, store } = props
      let { value } = event.target
      // convert string to number
      value = value ? +value : value
      store.map.changePanToY(value)
      // immediately cancel possible existing error
      if (yIsValid(value)) changeYError('')
    },
    onBlurX: props => () => {
      const { changeXError, store } = props
      if (xIsValid(store.map.panToX)) {
        changeXError('')
      } else {
        changeXError(`x muss zwischen 2'485'071 und 2'828'515 liegen`)
      }
    },
    onBlurY: props => () => {
      const { store, changeYError } = props
      if (yIsValid(store.map.panToY)) {
        changeYError('')
      } else {
        changeYError(`y muss zwischen 1'075'346 und 1'299'941 liegen`)
      }
    },
  }),
  observer
)

class PanToCoordinates extends Component {
  props: {
    store: Object,
    controlType: string,
    onClickCoordinates: () => void,
    onClickGoto: () => void,
    onChangeX: () => void,
    onChangeY: () => void,
    xError: string,
    yError: string,
    onBlurX: () => void,
    onBlurY: () => void,
    onBlurGotoContainer: () => void,
    onFocusGotoContainer: () => void,
    onClickClear: () => void,
    changeControlType: () => void,
  }

  xkoordField: ?HTMLDivElement

  componentDidMount() {
    ReactDOM.findDOMNode(this.xkoordField)
      .getElementsByTagName('input')[0]
      .focus()
  }

  render() {
    const {
      onClickGoto,
      onChangeX,
      onChangeY,
      xError,
      yError,
      onBlurX,
      onBlurY,
      onBlurGotoContainer,
      onFocusGotoContainer,
      onClickClear,
      store,
    } = this.props
    const { panToX: x, panToY: y, panToMarker } = store.map

    return (
      <Container onBlur={onBlurGotoContainer} onFocus={onFocusGotoContainer}>
        <FormControl error={!!xError} fullWidth aria-describedby="xhelper">
          <InputLabel htmlFor="XKoordinate">X-Koordinate</InputLabel>
          <StyledInput
            id="XKoordinate"
            value={x}
            type="number"
            min="2485071"
            max="2828516"
            onChange={onChangeX}
            onBlur={onBlurX}
            ref={c => (this.xkoordField = c)}
          />
          <FormHelperText id="xhelper">{xError}</FormHelperText>
        </FormControl>
        <FormControl error={!!yError} fullWidth aria-describedby="yhelper">
          <InputLabel htmlFor="YKoordinate">Y-Koordinate</InputLabel>
          <StyledInput
            id="YKoordinate"
            value={y}
            type="number"
            min="1075346"
            max="1299942"
            onChange={onChangeY}
            onBlur={onBlurY}
            ref={c => (this.ykoordField = c)}
          />
          <FormHelperText id="yhelper">{yError}</FormHelperText>
        </FormControl>
        <StyledIconButton
          title="auf Koordinaten zentrieren"
          aria-label="auf Koordinaten zentrieren"
          onClick={onClickGoto}
          disabled={!(!!x && !!y && xIsValid(x) && yIsValid(y))}
        >
          <StyledPanIcon
            disabled={!(!!x && !!y && xIsValid(x) && yIsValid(y))}
          />
        </StyledIconButton>
        <StyledIconButton
          title="Markierung und Koordinaten entfernen"
          aria-label="Markierung und Koordinaten entfernen"
          onClick={onClickClear}
          disabled={!(panToMarker || !!x || !!y)}
        >
          <StyledClearIcon disabled={!(panToMarker || !!x || !!y)} />
        </StyledIconButton>
      </Container>
    )
  }
}

export default enhance(PanToCoordinates)
