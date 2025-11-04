import { useContext } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'

import { StyledTableCell } from './index.jsx'
import { MobxContext } from '../../../mobxContext.js'

import { link } from './CellForTpopLink.module.css'
import { min } from 'date-fns'

export const CellForTpopLink = observer(({ field, width, row, isOdd }) => {
  const store = useContext(MobxContext)

  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = () => hovered.setTpopId(row.id)

  const onClickLink = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      window.open(field.value, '_blank', 'toolbar=no')
    }
    window.open(field.value)
  }

  const tableCellStyle = {
    width,
    minWidth: width,
    backgroundColor: isOdd ? 'rgb(255, 255, 252)' : 'unset',
  }

  return (
    <StyledTableCell
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      style={tableCellStyle}
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
    </StyledTableCell>
  )
})
