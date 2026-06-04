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

  return [projekteTabs, setProjekteTabs]
}
