import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../../mobxContext.js'
import { useDocsNavData } from '../../modules/useDocsNavData.js'
import { List as SharedList } from '../shared/List/index.jsx'
import { Menu } from './Menu.jsx'

export const MobileList = memo(
  observer(() => {
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
  }),
)
