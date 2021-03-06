import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { Link } from 'gatsby'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'
import MenuItems from './MenuItems'
import Filter from './Filter'

const Menu = styled.div`
  width: 25%;
  min-width: 320px;
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  overflow-y: auto;
  padding: 25px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`
const MenuTitle = styled.div`
  padding: 0 16px;
`
const MenuTitleLink = styled(Link)`
  font-size: 21px;
  font-weight: 700;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
  &:hover {
    text-decoration: underline;
  }
`

const Sidebar = ({ title, titleLink, edges }) => {
  const store = useContext(storeContext)
  const {
    technDokuFilter,
    benutzerDokuFilter,
    setTechnDokuFilter,
    setBenutzerDokuFilter,
    appBarHeight,
  } = store
  const filter =
    title === 'Benutzer-Dokumentation' ? benutzerDokuFilter : technDokuFilter
  const setFilter =
    title === 'Benutzer-Dokumentation'
      ? setBenutzerDokuFilter
      : setTechnDokuFilter

  const items = edges
    .filter((n) => !!n && !!n.node)
    .filter((n) =>
      !!filter
        ? get(n, 'node.frontmatter.title', '(Titel fehlt)')
            .toLowerCase()
            .includes(filter.toLowerCase())
        : true,
    )

  return (
    <Menu data-appbar-height={appBarHeight}>
      <MenuTitle>
        <MenuTitleLink to={titleLink}>{title}</MenuTitleLink>
        <Filter filter={filter} setFilter={setFilter} />
      </MenuTitle>
      <MenuItems items={items} />
    </Menu>
  )
}

export default observer(Sidebar)
