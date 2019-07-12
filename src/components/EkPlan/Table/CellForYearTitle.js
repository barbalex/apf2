import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StyledTableCell, InfoRow } from './index'
import storeContext from '../../../storeContext'

const CellForYearTitle = () => {
  const store = useContext(storeContext)
  const { showEk, showEkf, showMassn } = store.ekPlan

  return (
    <StyledTableCell>
      {showEk && <InfoRow>EK:</InfoRow>}
      {showEkf && <InfoRow>EKF:</InfoRow>}
      {showMassn && <InfoRow>Ansied:</InfoRow>}
    </StyledTableCell>
  )
}

export default observer(CellForYearTitle)
