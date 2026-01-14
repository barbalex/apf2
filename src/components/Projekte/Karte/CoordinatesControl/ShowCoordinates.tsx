import { useContext } from 'react'
import 'leaflet'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.ts'
import styles from './ShowCoordinates.module.css'

export const ShowCoordinates = observer(({ setControlType }) => {
  const { mapMouseCoordinates } = useContext(MobxContext)
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
})
