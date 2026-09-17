import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
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
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navDataForList}
        MenuBarComponent={(props) => <Menu {...props} row={navData} />}
        menuBarProps={{ row: navData }}
      />
    </Suspense>
  )
}
