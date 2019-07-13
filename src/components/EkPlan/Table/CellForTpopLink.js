import React, { useCallback, useContext } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import { StyledTableCell } from './index'
import storeContext from '../../../storeContext'

const Link = styled.div`
  margin-left: 8px;
  margin-bottom: -2px;
  cursor: pointer;
  svg {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.77);
  }
`

const CellForTpopLink = ({ field, style, row }) => {
  const store = useContext(storeContext)

  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [row.id])

  const onClickLink = useCallback(() => {
    typeof window !== 'undefined' && window.open(field.value)
  }, [])

  return (
    <StyledTableCell
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
    >
      <Link onClick={onClickLink} title="in neuem Fenster öffnen">
        <FaExternalLinkAlt />
      </Link>
    </StyledTableCell>
  )
}

export default observer(CellForTpopLink)
