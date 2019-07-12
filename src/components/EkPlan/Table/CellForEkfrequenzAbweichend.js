import React from 'react'
import { observer } from 'mobx-react-lite'

import Checkbox from './Row/Checkbox'
import { StyledCellForSelect } from './index'

const CellForEkfrequenzAbweichend = ({ field, row }) => (
  <StyledCellForSelect>
    <Checkbox row={row.tpop} value={field.value} field="ekfrequenzAbweichend" />
  </StyledCellForSelect>
)

export default observer(CellForEkfrequenzAbweichend)
