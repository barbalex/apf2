import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'

import { nodeFromMenu } from './nodeFromMenu.js'
import { checkIfIsOpen } from './checkIfIsOpen.js'
import { NodeWithList } from './NodeWithList.jsx'

export const RootNodeWithList = memo(
  observer(({ fetcher }) => {
    const store = useContext(MobxContext)

    const { navData } = fetcher()
    const node = nodeFromMenu(navData)
    const isOpen = checkIfIsOpen({ store, menu: navData })

    return <NodeWithList menu={navData} />
  }),
)
