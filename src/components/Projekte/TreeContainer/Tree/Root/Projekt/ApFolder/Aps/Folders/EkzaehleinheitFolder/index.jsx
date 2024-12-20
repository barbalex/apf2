import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'
import { Ekzaehleinheits } from './Ekzaehleinheits.jsx'

export const EkZaehleinheitFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Zähleinheiten']

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'EK-Zähleinheiten',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'ekzaehleinheitFolder',
      id: `${ap.id}Ekzaehleinheit`,
      tableId: ap.id,
      urlLabel: 'EK-Zähleinheiten',
      label: menu.label,
      url,
      hasChildren: menu.count > 0,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Ekzaehleinheits
              projekt={projekt}
              ap={ap}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
