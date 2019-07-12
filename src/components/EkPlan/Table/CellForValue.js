import React from 'react'
import { observer } from 'mobx-react-lite'

import { StyledTableCell } from './index'

const CellForValue = ({ field, style }) => {
  const { value } = field

  return (
    <StyledTableCell style={style}>
      <div>{value}</div>
    </StyledTableCell>
  )
}

export default observer(CellForValue)
