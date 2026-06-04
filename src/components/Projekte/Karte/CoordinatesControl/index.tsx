import { useState, useEffect } from 'react'
import 'leaflet'
import { useMapEvents } from 'react-leaflet'
import { debounce } from 'es-toolkit'
import { useSetAtom } from 'jotai'

import { ShowCoordinates } from './ShowCoordinates.tsx'
import { PanToCoordinates } from './PanToCoordinates.tsx'
import { epsg4326to2056 } from '../../../../modules/epsg4326to2056.ts'
import { setMapMouseCoordinatesAtom } from '../../../../store/index.ts'

import styles from './index.module.css'

/**
 * onClick coordinates container: render coordinate-field-pair and go-to button
 * onBlur coordinate-field-pair-container: render coordinates
 * onBlur coordinate field: validate coordinates
 * onClick go-to button:
 * - do nothing if coordinates are invalid, else:
 * - move to coordinates
 * - render coordinates
 */

export const CoordinatesControl = () => {
  const setMapMouseCoordinates = useSetAtom(setMapMouseCoordinatesAtom)
  const [controlType, setControlType] = useState('coordinates')

  const setMouseCoords = (e) => {
    // console.log('setMouseCoordinates')
    const [x, y] = epsg4326to2056(e.latlng.lng, e.latlng.lat)
    setMapMouseCoordinates({ x, y })
  }

  const onMouseMove = debounce(setMouseCoords, 50)

  const map = useMapEvents({
    mousemove(e) {
      onMouseMove(e)
    },
  })
  // hack to get control to show on first load
  // see: https://github.com/LiveBy/react-leaflet-control/issues/27#issuecomment-430564722
  useEffect(() => {
    setControlType('coordinates')
  }, [])

  return (
    <div className={styles.container}>
      {controlType === 'coordinates' ?
        <ShowCoordinates setControlType={setControlType} />
      : <PanToCoordinates
          setControlType={setControlType}
          map={map}
        />
      }
    </div>
  )
}
