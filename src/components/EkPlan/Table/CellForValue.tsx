import { useAtomValue, useSetAtom } from 'jotai'

import {
  ekPlanHoveredAtom,
  ekPlanSetHoveredTpopIdAtom,
  ekPlanResetHoveredAtom,
} from '../../../store/index.ts'
import type { TpopRow } from './tableTypes.ts'

import styles from './CellForValue.module.css'
import indexStyles from './index.module.css'

export const CellForValue = ({
  field,
  width,
  row,
  isOdd,
  firstChild,
}: {
  field: Record<string, unknown>
  width: number | undefined
  row: TpopRow
  isOdd: boolean
  firstChild: boolean
}) => {
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredTpopId = useSetAtom(ekPlanSetHoveredTpopIdAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)

  const { value } = field

  const isHovered = hovered.tpopId === row.id
  const onMouseEnter = () => setHoveredTpopId(row.id)

  const tableCellStyle = {
    width,
    minWidth: width,
    paddingLeft: firstChild ? 10 : 2,
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
      style={tableCellStyle}
    >
      <div className={styles.container}>
        <div>{value as React.ReactNode}</div>
      </div>
    </div>
  )
}
