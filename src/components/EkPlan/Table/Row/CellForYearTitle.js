import React from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import { EkTableCell } from '../index'

const InfoRow = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const CellForYearTitle = ({ field }) => {
  const { width } = field

  return (
    <EkTableCell width={width}>
      <InfoRow>EK:</InfoRow>
      <InfoRow>EKF:</InfoRow>
    </EkTableCell>
  )
}

export default observer(CellForYearTitle)
