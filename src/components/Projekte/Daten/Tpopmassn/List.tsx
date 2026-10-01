
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { useTpopmassnNavData } from '../../../../modules/useTpopmassnNavData.ts'

export const List = () => {
  const navData = useTpopmassnNavData()

  // SharedList expects NavData; menus may carry explicit undefined
  // labelRightElements, which exactOptionalPropertyTypes rejects
  const navDataForList = {
    ...navData,
    menus: navData.menus.map((menu) => ({
      id: menu.id,
      label: menu.label,
      ...(menu.labelRightElements ?
        { labelRightElements: menu.labelRightElements }
      : {}),
    })),
  }

  return (
    <SharedList
      navData={navDataForList}
      MenuBarComponent={(props) => <Menu {...props} row={navData} />}
      menuBarProps={{ row: navData }}
    />
  )
}
