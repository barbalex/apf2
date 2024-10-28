import { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StyledTableCell } from './index.jsx'
import { StoreContext } from '../../../storeContext.js'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const CellForValue = observer(({ field, style, row, firstChild }) => {
  const store = useContext(StoreContext)

  const { value } = field

  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(
    () => hovered.setTpopId(row.id),
    [hovered, row.id],
  )

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
})
