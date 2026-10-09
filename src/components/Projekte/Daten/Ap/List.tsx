import { useParams } from 'react-router'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { useApNavData } from '../../../../modules/useApNavData.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const params = useParams<{ projId: string }>()
  // menus contain more properties than shared List needs
  const navData = useApNavData(params) as NavData

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
    />
  )
}
