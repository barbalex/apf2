import { useState, useEffect, useRef } from 'react'
import 'leaflet'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdMyLocation, MdClear } from 'react-icons/md'

import { epsg2056to4326 } from '../../../../modules/epsg2056to4326.ts'
import panCentreIcon from '../../../../etc/panTo.png'

import styles from './PanToCoordinates.module.css'

const xIsValid = (x) => !x || (x >= 2485071 && x < 2828516)
const yIsValid = (y) => !y || (y >= 1075346 && y < 1299942)

export const PanToCoordinates = ({ setControlType, map }) => {
  const xkoordField = useRef(null)

  useEffect(() => {
    xkoordField.current.getElementsByTagName('input')[0].focus()
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

  const onFocusGotoContainer = () => {
    clearTimeout(timeoutId)
    if (!gotoFocused) {
      changeGotoFocused(true)
    }
  }

  const onClickClear = () => {
    setMarker(null)
    if (marker) map.removeLayer(marker)
    setX('')
    setY('')
    setControlType('coordinates')
  }

  const onBlurGotoContainer = () => {
    const newTimeoutId = setTimeout(() => {
      if (gotoFocused) {
        changeGotoFocused(false)
        setControlType('coordinates')
      }
    })
    changeTimeoutId(newTimeoutId)
  }

  /**
   * for unknown reason
   * onClickGoto happens TWICE
   * which means marker passed first time
   * is added to the map
   * but marker passed second time is saved in state...
   */
  const onClickGoto = () => {
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
  }

  const onChangeX = (event) => {
    let { value } = event.target
    // convert string to number
    value = value ? +value : value
    setX(value)
    // immediately cancel possible existing error
    if (xIsValid(value)) changeXError('')
  }

  const onChangeY = (event) => {
    let { value } = event.target
    // convert string to number
    value = value ? +value : value
    setY(value)
    // immediately cancel possible existing error
    if (yIsValid(value)) changeYError('')
  }

  const onBlurX = (event) => {
    // prevent onBlurGotoContainer
    event.stopPropagation()
    if (xIsValid(x)) return changeXError('')
    changeXError(`x muss zwischen 2'485'071 und 2'828'515 liegen`)
  }

  const onBlurY = (event) => {
    // prevent onBlurGotoContainer
    event.stopPropagation()
    if (yIsValid(y)) return changeYError('')
    changeYError(`y muss zwischen 1'075'346 und 1'299'941 liegen`)
  }

  const centerOnCoordsDisabled = !(!!x && !!y && xIsValid(x) && yIsValid(y))
  const centerOnCoordsTitle =
    centerOnCoordsDisabled ?
      'x- und y-Koordinaten eingeben, um darauf zu zentrieren'
    : 'auf Koordinaten zentrieren'

  return (
    <div
      className={styles.container}
      onBlur={onBlurGotoContainer}
      onFocus={onFocusGotoContainer}
    >
      <FormControl
        error={!!xError}
        fullWidth
        aria-describedby="xhelper"
        variant="standard"
      >
        <InputLabel htmlFor="XKoordinate">X-Koordinate</InputLabel>
        <Input
          id="XKoordinate"
          value={x}
          type="number"
          min="2485071"
          max="2828516"
          onChange={onChangeX}
          onBlur={onBlurX}
          ref={xkoordField}
          className={styles.input}
        />
        <FormHelperText id="xhelper">{xError}</FormHelperText>
      </FormControl>
      <FormControl
        error={!!yError}
        fullWidth
        aria-describedby="yhelper"
        variant="standard"
      >
        <InputLabel htmlFor="YKoordinate">Y-Koordinate</InputLabel>
        <Input
          id="YKoordinate"
          value={y}
          type="number"
          min="1075346"
          max="1299942"
          onChange={onChangeY}
          onBlur={onBlurY}
          className={styles.input}
        />
        <FormHelperText id="yhelper">{yError}</FormHelperText>
      </FormControl>
      <Tooltip title={centerOnCoordsTitle}>
        <span>
          <IconButton
            aria-label={centerOnCoordsTitle}
            onClick={onClickGoto}
            style={{ cursor: centerOnCoordsDisabled ? 'pointer' : 'default' }}
            className={styles.iconButton}
          >
            <MdMyLocation
              style={{ color: centerOnCoordsDisabled ? 'grey' : 'unset' }}
              className={styles.panIcon}
            />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="schliessen">
        <IconButton
          aria-label="schliessen"
          onClick={onClickClear}
          className={styles.iconButton}
        >
          <MdClear className={styles.clearIcon} />
        </IconButton>
      </Tooltip>
    </div>
  )
}
