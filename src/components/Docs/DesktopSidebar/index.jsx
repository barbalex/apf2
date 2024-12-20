import { memo, useContext } from 'react'
import styled from '@emotion/styled'
import { Link, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'
import { MenuItems } from './MenuItems.jsx'
import { Filter } from './Filter.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'

const Menu = styled.div`
  width: 25%;
  min-width: 320px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 25px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
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

export const Sidebar = memo(
  observer(() => {
    const { search } = useLocation()

    const store = useContext(MobxContext)
    const { dokuFilter, setDokuFilter } = store

    return (
      <Menu>
        <MenuTitle>
          <MenuTitleLink to={`/Dokumentation/${search}`}>
            Dokumentation
          </MenuTitleLink>
          <Filter
            filter={dokuFilter}
            setFilter={setDokuFilter}
          />
        </MenuTitle>
        <MenuItems />
        <IntoViewScroller />
      </Menu>
    )
  }),
)
