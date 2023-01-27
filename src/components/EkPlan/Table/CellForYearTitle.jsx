import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { StyledTableCell, InfoRow } from './index'
import storeContext from '../../../storeContext'

const CellForYearTitle = ({ style, row }) => {
  const store = useContext(storeContext)
  const { showEk, showEkf, showMassn, hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [
    hovered,
    row.id,
  ])

  return (
    <StyledTableCell
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={row.isOdd}
    >
      {showEk && <InfoRow>EK:</InfoRow>}
      {showEkf && <InfoRow>EKF:</InfoRow>}
      {showMassn && <InfoRow>Ansied:</InfoRow>}
    </StyledTableCell>
  )
}

export default observer(CellForYearTitle)
