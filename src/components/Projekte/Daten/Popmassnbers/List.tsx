import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { usePopmassnbersNavData } from '../../../../modules/usePopmassnbersNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = usePopmassnbersNavData()

  return (
    <SharedList
      navData={{
        ...navData,
        menus: (navData.menus ?? []).map((menu) => ({
          id: menu.id as string,
          label: menu.label,
        })),
      }}
      MenuBarComponent={Menu}
      highlightSearchString={nodeLabelFilter.popmassnber}
    />
  )
}
