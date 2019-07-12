import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import { EkTableCell } from '../index'

const CellForValue = ({ field }) => {
  const store = useContext(storeContext)

  const { label, value, width } = field

  return (
    <EkTableCell key={label} width={width}>
      <div>{value}</div>
    </EkTableCell>
  )
}

export default observer(CellForValue)
