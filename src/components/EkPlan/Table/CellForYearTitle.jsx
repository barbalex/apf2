import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StyledTableCell, InfoRow } from './index.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { yearColumnWidth } from './CellForYear/yearColumnWidth.js'

export const CellForYearTitle = observer(({ row, isOdd }) => {
  const store = useContext(MobxContext)
  const { showEk, showEkf, showMassn, hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = () => hovered.setTpopId(row.id)

  const style = {
    width: yearColumnWidth,
    minWidth: yearColumnWidth,
    backgroundColor: isOdd ? 'rgb(255, 255, 252)' : 'unset',
  }

  return (
    <StyledTableCell
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      style={style}
    >
      {showEk && <InfoRow>EK:</InfoRow>}
      {showEkf && <InfoRow>EKF:</InfoRow>}
      {showMassn && <InfoRow>Ansied:</InfoRow>}
    </StyledTableCell>
  )
})
