import React from 'react'
import { observer } from 'mobx-react-lite'

import { StyledTableCell } from './index'

const CellForValue = ({ field }) => {
  const { value } = field

  return (
    <StyledTableCell>
      <div>{value}</div>
    </StyledTableCell>
  )
}

export default observer(CellForValue)
