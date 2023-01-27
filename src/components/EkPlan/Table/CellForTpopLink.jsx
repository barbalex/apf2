import React, { useCallback, useContext } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StyledTableCell } from './index'
import storeContext from '../../../storeContext'

const Link = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  div {
    margin: auto;
  }
  svg {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.77);
  }
`

const CellForTpopLink = ({ field, style, row }) => {
  const store = useContext(storeContext)

  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(
    () => hovered.setTpopId(row.id),
    [hovered, row.id],
  )

  const onClickLink = useCallback(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      window.open(field.value, '_blank', 'toolbar=no')
    }
    window.open(field.value)
  }, [field.value])

  return (
    <StyledTableCell
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={row.isOdd}
    >
      <Link onClick={onClickLink} title="in neuem Fenster öffnen">
        <div>
          <FaExternalLinkAlt />
        </div>
      </Link>
    </StyledTableCell>
  )
}

export default observer(CellForTpopLink)
