import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StyledTableCell, InfoRow } from './index.jsx'
import { MobxContext } from '../../../mobxContext.js'

export const CellForYearTitle = observer(({ width, row, isOdd }) => {
  const store = useContext(MobxContext)
  const { showEk, showEkf, showMassn, hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = () => hovered.setTpopId(row.id)

  return (
    <StyledTableCell
      width={width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={isOdd}
    >
      {showEk && <InfoRow>EK:</InfoRow>}
      {showEkf && <InfoRow>EKF:</InfoRow>}
      {showMassn && <InfoRow>Ansied:</InfoRow>}
    </StyledTableCell>
  )
})
