import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../Row.jsx'
import { MobxContext } from '../../../../../../../mobxContext.js'
import { Aps } from './Aps/index.jsx'

export const ApFolder = memo(
  observer(({ count, countFiltered, projekt, isLoading }) => {
    const store = useContext(MobxContext)
    const { openNodes } = store.tree

    const isOpen =
      openNodes.filter(
        (n) => n[0] === 'Projekte' && n[1] === projekt.id && n[2] === 'Arten',
      ).length > 0

    const url = ['Projekte', projekt.id, 'Arten']

    const node = {
      nodeType: 'folder',
      menuType: 'apFolder',
      id: `${projekt.id}ApFolder`,
      tableId: projekt.id,
      urlLabel: 'Arten',
      label: `Arten (${isLoading ? '...' : `${countFiltered}/${count}`})`,
      url,
      hasChildren: count > 0,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && <Aps projekt={projekt} />}
        </TransitionGroup>
      </>
    )
  }),
)
