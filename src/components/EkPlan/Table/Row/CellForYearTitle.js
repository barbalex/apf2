import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { EkTableCell, InfoRow } from '../index'
import storeContext from '../../../../storeContext'

const CellForYearTitle = ({ field, scrollPositions }) => {
  const store = useContext(storeContext)
  const { showEk, showEkf } = store.ekPlan
  const { width } = field

  return (
    <EkTableCell width={width} data-left={scrollPositions[field.name]}>
      {showEk && <InfoRow>EK:</InfoRow>}
      {showEkf && <InfoRow>EKF:</InfoRow>}
    </EkTableCell>
  )
}

export default observer(CellForYearTitle)
