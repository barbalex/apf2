import { memo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'

import { FormTitle } from '../FormTitle/index.jsx'
import { ErrorBoundary } from '../ErrorBoundary.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  scrollbar-width: thin;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  border-top: rgba(46, 125, 50, 0.5) solid 1px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: rgba(103, 216, 101, 0.07);
  }
  &:last-child {
    border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
  }
`

export const List = memo(({ items, title, totalCount, menuBar = null }) => {
  const navigate = useNavigate()
  const { search } = useLocation()

  const onClickRow = useCallback(
    (item) => navigate(`./${item.id}${search}`),
    [navigate, search],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title={`${title} (${items.length}/${totalCount ?? items.length})`}
          menuBar={menuBar}
        />
        <ListContainer>
          {items.map((item) => (
            <Row
              key={item.id}
              onClick={onClickRow.bind(this, item)}
            >
              {item.label}
            </Row>
          ))}
        </ListContainer>
      </Container>
    </ErrorBoundary>
  )
})
