import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import Select from './Row/Select'
import { StyledCellForSelect } from './index'

const CellForEkAbrechnungstyp = ({ field, row }) => {
  const store = useContext(storeContext)
  const { ekAbrechnungstypOptions } = store.ekPlan

  return (
    <StyledCellForSelect>
      <Select
        options={ekAbrechnungstypOptions}
        row={row}
        val={field}
        field="ekAbrechnungstyp"
      />
    </StyledCellForSelect>
  )
}

export default observer(CellForEkAbrechnungstyp)
