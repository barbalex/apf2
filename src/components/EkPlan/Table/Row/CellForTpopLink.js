import React, { useCallback } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import { EkTableCell } from '../index'

const Link = styled.div`
  margin-left: 8px;
  margin-bottom: -2px;
  cursor: pointer;
  svg {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.77);
  }
`

const CellForTpopLink = ({
  field,
  columnHovered,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
}) => {
  const onMouseEnter = useCallback(() => setColumnHovered(field.label), [field])
  const onClickLink = useCallback(() => {
    typeof window !== 'undefined' && window.open(field.value)
  }, [])

  return (
    <EkTableCell
      width={field.width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-columnishovered={columnHovered === field.label}
      data-left={scrollPositions[field.name]}
    >
      <Link onClick={onClickLink} title="in neuem Fenster öffnen">
        <FaExternalLinkAlt />
      </Link>
    </EkTableCell>
  )
}

export default observer(CellForTpopLink)
