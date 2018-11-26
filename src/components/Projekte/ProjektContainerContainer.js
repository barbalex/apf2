//@flow
import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import mobxStoreContext from '../../mobxStoreContext'
import ProjektContainer from './ProjektContainer'

const ProjektContainerContainer = ({
  treeName,
  tabs,
  projekteTabs,
}: {
  treeName: string,
  tabs: Array<string>,
  projekteTabs: Array<string>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { openNodes, activeNodeArray } = mobxStore[treeName]

  return (
    <ProjektContainer
      treeName={treeName}
      tabs={tabs}
      projekteTabs={projekteTabs}
      openNodes={openNodes}
      activeNodeArray={activeNodeArray}
    />
  )
}

export default observer(ProjektContainerContainer)
