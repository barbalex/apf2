//@flow
/**
 * openNodes and activeNodeArray are passed here
 * to make sure all the depending queries in hoc's
 * of ProjektContainer are re-run every time they change
 * (no observer in the hoc's)
 * apFilter: weird. Is updated if called here, does not need
 * to be passed down...
 */
import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

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
  /*
  console.log('ProjektContainerContainer', {
    openNodes: getSnapshot(openNodes),
    activeNodeArray: getSnapshot(activeNodeArray),
  })*/

  /**
   * pass snapshots
   * seems to update data more reliably
   */
  return (
    <ProjektContainer
      treeName={treeName}
      tabs={tabs}
      projekteTabs={projekteTabs}
      openNodes={getSnapshot(openNodes)}
      activeNodeArray={getSnapshot(activeNodeArray)}
      //apFilter={apFilter}
    />
  )
}

export default observer(ProjektContainerContainer)
