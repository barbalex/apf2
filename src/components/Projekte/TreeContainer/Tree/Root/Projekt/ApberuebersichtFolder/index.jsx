import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../Row.jsx'
import { MobxContext } from '../../../../../../../mobxContext.js'
import { Apberuebersichts } from './Apberuebersichts.jsx'

export const ApberuebersichtFolder = memo(
  observer(({ count, countFiltered, projekt, isLoading }) => {
    const store = useContext(MobxContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[0] === 'Projekte' && n[1] === projekt.id && n[2] === 'AP-Berichte',
      ).length > 0

    const node = {
      menuType: 'apberuebersichtFolder',
      id: `${projekt.id}/ApberuebersichtsFolder`,
      tableId: projekt.id,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${isLoading ? '...' : `${countFiltered}/${count}`})`,
      url: ['Projekte', projekt.id, 'AP-Berichte'],
      hasChildren: count > 0,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && <Apberuebersichts projekt={projekt} />}
        </TransitionGroup>
      </>
    )
  }),
)
