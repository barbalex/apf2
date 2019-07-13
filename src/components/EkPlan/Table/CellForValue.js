import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { StyledTableCell } from './index'
import storeContext from '../../../storeContext'

const CellForValue = ({ field, style, row }) => {
  const store = useContext(storeContext)

  const { value } = field

  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [row.id])

  return (
    <StyledTableCell
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={row.isOdd}
    >
      <div>{value}</div>
    </StyledTableCell>
  )
}

export default observer(CellForValue)
