import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { usePopNavData } from '../../../../modules/usePopNavData.ts'

export const List = () => {
  const navData = usePopNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={{
          ...navData,
          menus: navData.menus.map((menu) => ({
            id: menu.id,
            label: menu.label,
            ...(menu.labelLeftElements && {
              labelLeftElements: menu.labelLeftElements.filter(
                (element) => element !== undefined,
              ),
            }),
            ...(menu.labelRightElements && {
              labelRightElements: menu.labelRightElements,
            }),
          })),
        }}
        MenuBarComponent={Menu}
        menuBarProps={{ row: navData }}
      />
    </Suspense>
  )
}
