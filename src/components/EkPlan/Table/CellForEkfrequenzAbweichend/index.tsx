import { useAtomValue, useSetAtom } from 'jotai'

import { Checkbox } from './Checkbox.tsx'
import {
  ekPlanHoveredAtom,
  ekPlanSetHoveredTpopIdAtom,
  ekPlanResetHoveredAtom,
} from '../../../../store/index.ts'

import indexStyles from '../index.module.css'

export const CellForEkfrequenzAbweichend = ({
  field,
  row,
  isOdd,
  ekfrequenzAbweichend,
  width,
}) => {
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredTpopId = useSetAtom(ekPlanSetHoveredTpopIdAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)
  const isHovered = hovered.tpopId === row.id

  const onMouseEnter = () => setHoveredTpopId(row.id)

  const cellStyle = {
    maxWidth: width,
    minWidth: width,
    backgroundColor:
      isHovered ? 'hsla(45, 100%, 90%, 1)'
      : isOdd ? 'rgb(255, 255, 252)'
      : 'unset',
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetHovered}
      className={indexStyles.cellForSelect}
      style={cellStyle}
    >
      <Checkbox
        row={row.tpop}
        value={ekfrequenzAbweichend}
        field="ekfrequenzAbweichend"
      />
    </div>
  )
}
