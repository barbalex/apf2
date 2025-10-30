import { useContext } from 'react'
import 'leaflet'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { div } from './ShowCoordinates.module.css'

export const ShowCoordinates = observer(({ setControlType }) => {
  const { mapMouseCoordinates } = useContext(MobxContext)
  const x = mapMouseCoordinates.x?.toLocaleString('de-ch')
  const y = mapMouseCoordinates.y?.toLocaleString('de-ch')

  const onClick = () => setControlType('goto')

  return (
    <div
      className={div}
      onClick={onClick}
      title="Klicken um Koordinaten zu suchen"
    >
      {`${x}, ${y}`}
    </div>
  )
})
