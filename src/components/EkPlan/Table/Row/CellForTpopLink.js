import React, { useCallback, useContext } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../../../storeContext'
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

const CellForTpopLink = ({ field }) => {
  const store = useContext(storeContext)
  const { resetYearHovered, setColumnHovered, scrollPositions } = store.ekPlan

  const onMouseEnter = useCallback(() => setColumnHovered(`_${field.label}_`), [
    field,
  ])
  const onClickLink = useCallback(() => {
    typeof window !== 'undefined' && window.open(field.value)
  }, [])

  return (
    <EkTableCell
      width={field.width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-left={scrollPositions[field.name]}
    >
      <Link onClick={onClickLink} title="in neuem Fenster öffnen">
        <FaExternalLinkAlt />
      </Link>
    </EkTableCell>
  )
}

export default observer(CellForTpopLink)
