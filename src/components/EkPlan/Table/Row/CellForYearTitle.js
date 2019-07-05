import React from 'react'
import { observer } from 'mobx-react-lite'

import { EkTableCell, InfoRow } from '../index'

const CellForYearTitle = ({ field, scrollPositions }) => {
  const { width } = field

  return (
    <EkTableCell width={width} data-left={scrollPositions[field.name]}>
      <InfoRow>EK:</InfoRow>
      <InfoRow>EKF:</InfoRow>
    </EkTableCell>
  )
}

export default observer(CellForYearTitle)
