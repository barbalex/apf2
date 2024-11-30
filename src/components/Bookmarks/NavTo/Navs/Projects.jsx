import { memo } from 'react'

import { Nav } from '../Nav.jsx'

export const navData = {
  id: 'projekte',
  url: '/Daten/Projekte',
  label: `Projekte`,
  totalCount: 1,
  menus: [
    {
      id: 'e57f56f4-4376-11e8-ab21-4314b6749d13',
      label: `AP Flora Kt. Zürich`,
    },
  ],
}

export const Menu = memo(() => {
  return navData.menus.map((item, index) => (
    <Nav
      key={item.id}
      item={item}
      baseUrl={navData.url}
      needsBorderRight={index < navData.menus.length - 1}
    />
  ))
})
