import { uniq } from 'es-toolkit'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Item } from './Item.jsx'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  border-right: 1px solid rgb(46, 125, 50);
  box-sizing: border-box !important;
`

export const EkfList = ({ ekf }) => {
  const projektCount = uniq(ekf.map((e) => e.projekt)).length

  return (
    <Container>
      {ekf.map((ek) => (
        <Item
          key={ek.id}
          projektCount={projektCount}
          row={ek}
        />
      ))}
    </Container>
  )
}
