import { useContext } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'

import { link } from './CellForTpopLink.module.css'
import { tableCell } from './index.module.css'

export const CellForTpopLink = observer(({ field, width, row, isOdd }) => {
  const store = useContext(MobxContext)

  const { hovered } = store.ekPlan
  const isHovered = hovered.tpopId === row.id
  const onMouseEnter = () => hovered.setTpopId(row.id)

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
      onMouseLeave={hovered.reset}
      className={tableCell}
      style={cellStyle}
    >
      <div
        className={link}
        onClick={onClickLink}
        title="in neuem Fenster öffnen"
      >
        <div>
          <FaExternalLinkAlt />
        </div>
      </div>
    </div>
  )
})
