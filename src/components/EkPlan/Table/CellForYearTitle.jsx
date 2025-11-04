import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'
import { yearColumnWidth } from './CellForYear/yearColumnWidth.js'

import { infoRow, tableCell } from './index.module.css'

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
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={`${className} ${tableCell}`}
      style={style}
    >
      {showEk && <div className={infoRow}>EK:</div>}
      {showEkf && <div className={infoRow}>EKF:</div>}
      {showMassn && <div className={infoRow}>Ansied:</div>}
    </div>
  )
})
