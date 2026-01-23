import { useAtomValue, useSetAtom } from 'jotai'

import {
  ekPlanShowEkAtom,
  ekPlanShowEkfAtom,
  ekPlanShowMassnAtom,
  ekPlanHoveredAtom,
  ekPlanSetHoveredTpopIdAtom,
  ekPlanResetHoveredAtom,
} from '../../../store/index.ts'
import { yearColumnWidth } from './CellForYear/yearColumnWidth.ts'

import indexStyles from './index.module.css'

export const CellForYearTitle = ({ row, isOdd }) => {
  const showEk = useAtomValue(ekPlanShowEkAtom)
  const showEkf = useAtomValue(ekPlanShowEkfAtom)
  const showMassn = useAtomValue(ekPlanShowMassnAtom)
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredTpopId = useSetAtom(ekPlanSetHoveredTpopIdAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)

  const isHovered = hovered.tpopId === row.id
  const onMouseEnter = () => setHoveredTpopId(row.id)

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
      onMouseLeave={resetHovered}
      className={indexStyles.tableCell}
      style={style}
    >
      {showEk && <div className={indexStyles.infoRow}>EK:</div>}
      {showEkf && <div className={indexStyles.infoRow}>EKF:</div>}
      {showMassn && <div className={indexStyles.infoRow}>Ansied:</div>}
    </div>
  )
}
