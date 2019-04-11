import React, { useState, useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import 'leaflet'
import styled from 'styled-components'
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

const xIsValid = x => !x || (x >= 2485071 && x < 2828516)
const yIsValid = y => !y || (y >= 1075346 && y < 1299942)

const PanToCoordinates = ({ setControlType, map }) => {
  const xkoordField = useRef(null)

  useEffect(() => {
    ReactDOM.findDOMNode(xkoordField.current)
      .getElementsByTagName('input')[0]
      .focus()
  }, [])

  const [x, setX] = useState('')
  const [y, setY] = useState('')
  const [marker, setMarker] = useState(null)
  const [xError, changeXError] = useState('')
  const [yError, changeYError] = useState('')
  // on dealing with focus of div with children, see:
  // https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
  const [timeoutId, changeTimeoutId] = useState('')
  const [gotoFocused, changeGotoFocused] = useState(false)

  const onFocusGotoContainer = useCallback(
    event => {
      clearTimeout(timeoutId)
      if (!gotoFocused) {
        changeGotoFocused(true)
      }
    },
    [gotoFocused, timeoutId],
  )
  const onClickClear = useCallback(() => {
    setMarker(null)
    if (marker) map.removeLayer(marker)
    setX('')
    setY('')
    setControlType('coordinates')
  }, [marker, map])
  const onBlurGotoContainer = useCallback(
    event => {
      const newTimeoutId = setTimeout(() => {
        if (gotoFocused) {
          changeGotoFocused(false)
          setControlType('coordinates')
        }
      })
      changeTimeoutId(newTimeoutId)
    },
    [gotoFocused, timeoutId],
  )
  /**
   * for unknown reason
   * onClickGoto happens TWICE
   * which means marker passed first time
   * is added to the map
   * but marker passed second time is saved in state...
   */
  const onClickGoto = useCallback(() => {
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
  }, [x, y, xError, yError, map, marker])
  const onChangeX = useCallback(event => {
    let { value } = event.target
    // convert string to number
    value = value ? +value : value
    setX(value)
    // immediately cancel possible existing error
    if (xIsValid(value)) changeXError('')
  })
  const onChangeY = useCallback(event => {
    let { value } = event.target
    // convert string to number
    value = value ? +value : value
    setY(value)
    // immediately cancel possible existing error
    if (yIsValid(value)) changeYError('')
  })
  const onBlurX = useCallback(
    event => {
      // prevent onBlurGotoContainer
      event.stopPropagation()
      if (xIsValid(x)) return changeXError('')
      changeXError(`x muss zwischen 2'485'071 und 2'828'515 liegen`)
    },
    [x],
  )
  const onBlurY = useCallback(
    event => {
      // prevent onBlurGotoContainer
      event.stopPropagation()
      if (yIsValid(y)) return changeYError('')
      changeYError(`y muss zwischen 1'075'346 und 1'299'941 liegen`)
    },
    [y],
  )

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
          ref={xkoordField}
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
        <StyledPanIcon disabled={!(!!x && !!y && xIsValid(x) && yIsValid(y))} />
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

export default PanToCoordinates
