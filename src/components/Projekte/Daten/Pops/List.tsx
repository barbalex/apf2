import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { usePopsNavData } from '../../../../modules/usePopsNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = usePopsNavData()

  return (
    <SharedList
      navData={{
        ...navData,
        menus: (navData.menus ?? []).map((menu) => ({
          id: menu.id as string,
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
      highlightSearchString={nodeLabelFilter.pop}
    />
  )
}
