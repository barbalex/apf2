import { type ComponentType } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { useTpopNavData } from '../../../../modules/useTpopNavData.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const navData = useTpopNavData()

  return (
    <SharedList
      navData={navData as NavData}
      MenuBarComponent={
        Menu as unknown as ComponentType<{ toggleFilterInput?: () => void }>
      }
      menuBarProps={{ row: navData }}
    />
  )
}
