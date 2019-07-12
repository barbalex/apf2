import React, { useCallback } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import { StyledTableCell } from './index'

const Link = styled.div`
  margin-left: 8px;
  margin-bottom: -2px;
  cursor: pointer;
  svg {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.77);
  }
`

const CellForTpopLink = ({ field }) => {
  const onClickLink = useCallback(() => {
    typeof window !== 'undefined' && window.open(field.value)
  }, [])

  return (
    <StyledTableCell>
      <Link onClick={onClickLink} title="in neuem Fenster öffnen">
        <FaExternalLinkAlt />
      </Link>
    </StyledTableCell>
  )
}

export default observer(CellForTpopLink)
