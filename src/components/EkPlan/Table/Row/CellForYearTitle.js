import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { EkTableCell, InfoRow } from '../index'
import storeContext from '../../../../storeContext'

const CellForYearTitle = ({ field, scrollPosition }) => {
  const store = useContext(storeContext)
  const { showEk, showEkf, showMassn } = store.ekPlan
  const { width } = field

  return (
    <EkTableCell width={width} data-left={scrollPosition}>
      {showEk && <InfoRow>EK:</InfoRow>}
      {showEkf && <InfoRow>EKF:</InfoRow>}
      {showMassn && <InfoRow>Ansied:</InfoRow>}
    </EkTableCell>
  )
}

export default observer(CellForYearTitle)
