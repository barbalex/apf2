
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { useZielNavData } from '../../../../modules/useZielNavData.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const navData = useZielNavData()

  return (
    <SharedList
      navData={navData as NavData}
      MenuBarComponent={Menu}
    />
  )
}
