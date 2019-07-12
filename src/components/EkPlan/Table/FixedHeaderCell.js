import React from 'react'

import { StyledFixedHeaderCell } from './index'

const FixedHeaderCell = ({ index, style, column }) => {
  const { label, name } = column

  return (
    <StyledFixedHeaderCell style={style} className={`_${name}_`}>
      <span>{label}</span>
    </StyledFixedHeaderCell>
  )
}

export default FixedHeaderCell
