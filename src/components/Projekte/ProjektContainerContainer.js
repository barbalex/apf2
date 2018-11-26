//@flow
/**
 * openNodes and activeNodeArray are passed here
 * to make sure all the depending queries in hoc's
 * of ProjektContainer are re-run every time they change
 * (no observer in the hoc's)
 */
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
