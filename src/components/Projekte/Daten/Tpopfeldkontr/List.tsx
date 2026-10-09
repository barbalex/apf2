
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { useTpopfeldkontrNavData } from '../../../../modules/useTpopfeldkontrNavData.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const navData = useTpopfeldkontrNavData()

  return (
    <SharedList
      navData={navData as NavData}
      MenuBarComponent={Menu}
      menuBarProps={{ row: navData }}
    />
  )
}
