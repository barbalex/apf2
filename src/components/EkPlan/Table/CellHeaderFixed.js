import React from 'react'

import { StyledFixedHeaderCell } from './index'

const CellHeaderFixed = ({ style, column }) => {
  const { label } = column

  return (
    <StyledFixedHeaderCell style={style}>
      <span>{label}</span>
    </StyledFixedHeaderCell>
  )
}

export default CellHeaderFixed
