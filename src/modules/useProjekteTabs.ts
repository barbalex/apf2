import { useAtomValue } from 'jotai'

import { useSearchParamsState } from './useSearchParamsState.ts'
import { constants } from './constants.ts'
import { alwaysShowTreeAtom } from '../store/index.ts'

const isMobileView = window.innerWidth <= constants.mobileViewMaxWidth

export const useProjekteTabs = () => {
  const alwaysShowTree = useAtomValue(alwaysShowTreeAtom)
  const showTree = alwaysShowTree || !isMobileView
  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    showTree ?
      isMobileView ? ['tree']
      : ['tree', 'daten']
    : ['daten'],
  )

  return [projekteTabs, setProjekteTabs] as const
}

// the tree menus (folders in list views) only make sense when the nav tree
// pane is actually visible, i.e. when the tree tab is open in this pane
export const useShowTreeMenus = () => {
  const [projekteTabs] = useProjekteTabs()
  return projekteTabs.includes('tree')
}
