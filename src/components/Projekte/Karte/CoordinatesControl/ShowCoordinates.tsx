import 'leaflet'
import { useAtomValue } from 'jotai'

import { mapMouseCoordinatesAtom } from '../../../../store/index.ts'
import styles from './ShowCoordinates.module.css'

export const ShowCoordinates = ({ setControlType }) => {
  const mapMouseCoordinates = useAtomValue(mapMouseCoordinatesAtom)
  const x = mapMouseCoordinates.x?.toLocaleString('de-ch')
  const y = mapMouseCoordinates.y?.toLocaleString('de-ch')

  const onClick = () => setControlType('goto')

  return (
    <div
      className={styles.div}
      onClick={onClick}
      title="Klicken um Koordinaten zu suchen"
    >
      {`${x}, ${y}`}
    </div>
  )
}
