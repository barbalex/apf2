import { useNavigate, useLocation } from 'react-router'
import styled from '@emotion/styled'
import Highlighter from 'react-highlight-words'

import { FormTitle } from '../FormTitle/index.jsx'
import { ErrorBoundary } from '../ErrorBoundary.jsx'
import { navData } from '../../Bookmarks/NavTo/Navs/Projects.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  content-visibility: auto;
  contain-intrinsic-size: auto 45px;
`
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  scrollbar-width: thin;
`
const Row = styled.div`
  padding: 5px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 0;
  min-height: 35px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: rgba(103, 216, 101, 0.07);
  }
  border-top: rgba(46, 125, 50, 0.5) solid 1px;
  &:last-child {
    border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
  }
`

export const List = ({
  navData,
  MenuBarComponent = null,
  menuBarProps = {},
  highlightSearchString,
}) => {
  const navigate = useNavigate()
  const { search } = useLocation()

  const onClickRow = (item) => navigate(`./${item.id}${search}`)

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title={navData.label}
          listFilter={navData.listFilter}
          MenuBarComponent={MenuBarComponent}
          menuBarProps={menuBarProps}
        />
        <ListContainer>
          {navData.menus.map((item) => {
            const label = item.label ?? item.labelEkf ?? item.labelEk

            return (
              <Row
                key={item.id}
                onClick={onClickRow.bind(this, item)}
              >
                {!!item.labelLeftElements?.length &&
                  item.labelLeftElements.map((El, index) => <El key={index} />)}
                {highlightSearchString ?
                  <Highlighter
                    searchWords={[highlightSearchString]}
                    textToHighlight={label?.toString()}
                  />
                : label}
                {!!item.labelRightElements?.length &&
                  item.labelRightElements.map((El, index) => (
                    <El key={index} />
                  ))}
              </Row>
            )
          })}
        </ListContainer>
      </Container>
    </ErrorBoundary>
  )
}
