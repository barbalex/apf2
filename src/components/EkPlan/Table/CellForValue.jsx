import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StyledTableCell } from './index'
import storeContext from '../../../storeContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const CellForValue = ({ field, style, row, firstChild }) => {
  const store = useContext(storeContext)

  const { value } = field

  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [
    hovered,
    row.id,
  ])

  return (
    <StyledTableCell
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={row.isOdd}
      data-firstchild={firstChild}
    >
      <Container>
        <div>{value}</div>
      </Container>
    </StyledTableCell>
  )
}

export default observer(CellForValue)
