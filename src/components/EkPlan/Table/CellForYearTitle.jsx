import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'
import { yearColumnWidth } from './CellForYear/yearColumnWidth.js'

import indexStyles from './index.module.css'

export const CellForYearTitle = observer(({ row, isOdd }) => {
  const store = useContext(MobxContext)
  const { showEk, showEkf, showMassn, hovered } = store.ekPlan
  const isHovered = hovered.tpopId === row.id
  const onMouseEnter = () => hovered.setTpopId(row.id)

  const style = {
    maxWidth: yearColumnWidth,
    minWidth: yearColumnWidth,
    backgroundColor:
      isHovered ? 'hsla(45, 100%, 90%, 1)'
      : isOdd ? 'rgb(255, 255, 252)'
      : 'unset',
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={indexStyles.tableCell}
      style={style}
    >
      {showEk && <div className={indexStyles.infoRow}>EK:</div>}
      {showEkf && <div className={indexStyles.infoRow}>EKF:</div>}
      {showMassn && <div className={indexStyles.infoRow}>Ansied:</div>}
    </div>
  )
})
