import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Checkbox } from './Checkbox.tsx'
import { MobxContext } from '../../../../mobxContext.ts'

import indexStyles from '../index.module.css'

export const CellForEkfrequenzAbweichend = observer(
  ({ field, row, isOdd, ekfrequenzAbweichend, width }) => {
    const store = useContext(MobxContext)
    const { hovered } = store.ekPlan
    const isHovered = hovered.tpopId === row.id

    const onMouseEnter = () => hovered.setTpopId(row.id)

    const cellStyle = {
      maxWidth: width,
      minWidth: width,
      backgroundColor:
        isHovered ? 'hsla(45, 100%, 90%, 1)'
        : isOdd ? 'rgb(255, 255, 252)'
        : 'unset',
    }

    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        className={indexStyles.cellForSelect}
        style={cellStyle}
      >
        <Checkbox
          row={row.tpop}
          value={ekfrequenzAbweichend}
          field="ekfrequenzAbweichend"
        />
      </div>
    )
  },
)
