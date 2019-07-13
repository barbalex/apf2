import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import Checkbox from './Row/Checkbox'
import { StyledCellForSelect } from './index'
import storeContext from '../../../storeContext'

const CellForEkfrequenzAbweichend = ({ field, row, style }) => {
  const store = useContext(storeContext)

  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [row.id])

  return (
    <StyledCellForSelect
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
    >
      <Checkbox
        row={row.tpop}
        value={field.value}
        field="ekfrequenzAbweichend"
      />
    </StyledCellForSelect>
  )
}

export default observer(CellForEkfrequenzAbweichend)
