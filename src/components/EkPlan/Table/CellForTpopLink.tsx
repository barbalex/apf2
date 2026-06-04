import { FaExternalLinkAlt } from 'react-icons/fa'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  ekPlanHoveredAtom,
  ekPlanSetHoveredTpopIdAtom,
  ekPlanResetHoveredAtom,
} from '../../../store/index.ts'

import styles from './CellForTpopLink.module.css'
import indexStyles from './index.module.css'

export const CellForTpopLink = ({ field, width, row, isOdd }) => {
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredTpopId = useSetAtom(ekPlanSetHoveredTpopIdAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)

  const isHovered = hovered.tpopId === row.id
  const onMouseEnter = () => setHoveredTpopId(row.id)

  const onClickLink = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      window.open(field.value, '_blank', 'toolbar=no')
    }
    window.open(field.value)
  }

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
      className={indexStyles.tableCell}
      style={cellStyle}
    >
      <div
        className={styles.link}
        onClick={onClickLink}
        title="in neuem Fenster öffnen"
      >
        <div>
          <FaExternalLinkAlt />
        </div>
      </div>
    </div>
  )
}
