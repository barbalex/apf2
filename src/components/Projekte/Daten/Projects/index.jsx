import { memo } from 'react'

import { List } from '../../../shared/List/index.jsx'
import { navData } from '../../../Bookmarks/NavTo/Navs/Projects.jsx'

export const Component = memo(() => (
  <List
    items={navData.menus}
    title={navData.label}
  />
))
