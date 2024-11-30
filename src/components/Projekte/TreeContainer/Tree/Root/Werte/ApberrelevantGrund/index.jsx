import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../../storeContext.js'
import { Row } from '../../../Row.jsx'
import { ApberrelevantGrund } from './ApberrelevantGrund.jsx'

export const ApberrelevantGrundFolder = memo(
  observer(({ menu }) => {
    const store = useContext(StoreContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) => n[0] === 'Werte-Listen' && n[1] === 'ApberrelevantGrundWerte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopApberrelevantGrundWerteFolder',
      id: 'tpopApberrelevantGrundWerteFolder',
      urlLabel: 'ApberrelevantGrundWerte',
      label: menu?.label,
      url: ['Werte-Listen', 'ApberrelevantGrundWerte'],
      hasChildren: menu?.count > 0,
    }

    return (
      <>
        <Row
          key="wlApberrelevantGrundFolder"
          node={node}
        />
        {isOpen && <ApberrelevantGrund />}
      </>
    )
  }),
)
