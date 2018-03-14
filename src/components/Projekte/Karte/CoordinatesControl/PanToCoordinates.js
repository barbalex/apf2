import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import 'leaflet'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import PanIcon from 'material-ui/svg-icons/maps/my-location'
import ClearIcon from 'material-ui/svg-icons/content/clear'

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
`
const GotoButton = styled(FlatButton)`
  min-width: 30px !important;
  margin-top: 5px !important;
`
const GotoTextField = styled(TextField)`
  width: 150px !important;
  padding: 0 5px;
`

const xIsValid = (x: ?number) => !x || (x >= 470000 && x <= 850000)
const yIsValid = (y: ?number) => !y || (y >= 62000 && y <= 320000)

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
        changeXError(`x muss zwischen 470'000 und 850'000 liegen`)
      }
    },
    onBlurY: props => () => {
      const { store, changeYError } = props
      if (yIsValid(store.map.panToY)) {
        changeYError('')
      } else {
        changeYError(`y muss zwischen 62'000 und 320'000 liegen`)
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
        <GotoTextField
          type="number"
          min="470000"
          max="850000"
          value={x}
          onChange={onChangeX}
          onBlur={onBlurX}
          hintText="X-Koordinate"
          errorText={xError}
          ref={c => (this.xkoordField = c)}
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
          disabled={!(panToMarker || x || y)}
        />
      </Container>
    )
  }
}

export default enhance(PanToCoordinates)
