import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../../mobxContext.js'
import { useDocsNavData } from '../../modules/useDocsNavData.ts'
import { List as SharedList } from '../shared/List/index.tsx'
import { Menu } from './Menu.tsx'

export const MobileList = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData } = useDocsNavData()

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
      highlightSearchString={nodeLabelFilter.doc}
    />
  )
})
