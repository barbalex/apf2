import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StyledTableCell } from './index.jsx'
import { MobxContext } from '../../../mobxContext.js'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const CellForValue = observer(
  ({ field, width, row, isOdd, firstChild }) => {
    const store = useContext(MobxContext)

    const { value } = field

    const { hovered } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
    const onMouseEnter = () => hovered.setTpopId(row.id)

    return (
      <StyledTableCell
        width={width}
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        className={className}
        data-isodd={isOdd}
        data-firstchild={firstChild}
      >
        <Container>
          <div>{value}</div>
        </Container>
      </StyledTableCell>
    )
  },
)
