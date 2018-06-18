import React, { Component, createRef } from 'react'
import ReactDOM from 'react-dom'
import 'leaflet'
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
  max-width: 30px !important;
  cursor: ${props => (props.disabled ? 'pointer !important' : 'default')};
`
const StyledPanIcon = styled(PanIcon)`
  color: ${props => (props.disabled ? 'grey !important' : 'unset')};
`
const StyledClearIcon = styled(ClearIcon)`
  cursor: pointer !important;
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const xIsValid = (x: ?number) => !x || (x >= 2485071 && x < 2828516)
const yIsValid = (y: ?number) => !y || (y >= 1075346 && y < 1299942)

const enhance = compose(
  withState('x', 'setX', ''),
  withState('y', 'setY', ''),
  withState('marker', 'setMarker', null),
  withState('xError', 'changeXError', ''),
  withState('yError', 'changeYError', ''),
  // on dealing with focus of div with children, see:
  // https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
  withState('timeoutId', 'changeTimeoutId', ''),
  withState('gotoFocused', 'changeGotoFocused', false),
  withHandlers({
    onFocusGotoContainer: ({
      timeoutId,
      gotoFocused,
      changeGotoFocused
    }) => () => {
      clearTimeout(timeoutId)
      if (!gotoFocused) {
        changeGotoFocused(true)
      }
    },
    onClickClear: ({
      map,
      changeControlType,
      setX,
      setY,
      marker,
      setMarker
    }) => () => {
      setMarker(null)
      if (marker) map.removeLayer(marker)
      setX('')
      setY('')
      changeControlType('coordinates')
    },
    onBlurGotoContainer: ({
      changeTimeoutId,
      gotoFocused,
      changeGotoFocused,
      changeControlType,
    }) => () => {
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
    onClickGoto: ({
      xError,
      yError,
      map,
      x,
      y,
      marker,
      setMarker
    }) => () => {
      if (x && y && !xError && !yError) {
        const latLng = new window.L.LatLng(...epsg2056to4326(x, y))
        map.flyTo(latLng)
        const newMarker = window.L.marker(latLng, {
          title: `${x}/${y}`,
          icon: window.L.icon({
            iconUrl: panCentreIcon,
            iconSize: [36, 36],
          }),
        })
        if (marker) map.removeLayer(marker)
        newMarker.addTo(map)
        setMarker(newMarker)
      }
    },
    onChangeX: ({ changeXError, setX }) => event => {
      let { value } = event.target
      // convert string to number
      value = value ? +value : value
      setX(value)
      // immediately cancel possible existing error
      if (xIsValid(value)) changeXError('')
    },
    onChangeY: ({ changeYError, setY }) => event => {
      let { value } = event.target
      // convert string to number
      value = value ? +value : value
      setY(value)
      // immediately cancel possible existing error
      if (yIsValid(value)) changeYError('')
    },
    onBlurX: ({ changeXError, x }) => () => {
      if (xIsValid(x)) return changeXError('')
      changeXError(`x muss zwischen 2'485'071 und 2'828'515 liegen`)
    },
    onBlurY: ({ changeYError, y }) => () => {
      if (yIsValid(y)) return changeYError('')
      changeYError(`y muss zwischen 1'075'346 und 1'299'941 liegen`)
    },
  })
)

type Props = {
  controlType: string,
  onClickCoordinates: () => void,
  onClickGoto: () => void,
  onChangeX: () => void,
  onChangeY: () => void,
  x: string,
  y: string,
  xError: string,
  yError: string,
  onBlurX: () => void,
  onBlurY: () => void,
  setX: () => void,
  setY: () => void,
  onBlurGotoContainer: () => void,
  onFocusGotoContainer: () => void,
  onClickClear: () => void,
  changeControlType: () => void,
}

class PanToCoordinates extends Component<Props> {
  constructor(props) {
    super(props)
    this.xkoordField = createRef()
  }

  xkoordField: ?HTMLDivElement

  componentDidMount() {
    ReactDOM.findDOMNode(this.xkoordField.current)
      .getElementsByTagName('input')[0]
      .focus()
  }

  render() {
    const {
      onClickGoto,
      onChangeX,
      onChangeY,
      x,
      y,
      xError,
      yError,
      onBlurX,
      onBlurY,
      onBlurGotoContainer,
      onFocusGotoContainer,
      onClickClear,
    } = this.props

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
            innerRef={this.xkoordField}
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
          title="schliessen"
          aria-label="schliessen"
          onClick={onClickClear}
        >
          <StyledClearIcon />
        </StyledIconButton>
      </Container>
    )
  }
}

export default enhance(PanToCoordinates)
