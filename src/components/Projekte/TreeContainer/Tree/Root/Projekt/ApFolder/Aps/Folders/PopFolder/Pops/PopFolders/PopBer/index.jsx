import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Popbers } from './Popbers.jsx'

export const PopBerFolder = memo(
  observer(({ projekt, ap, pop, menu }) => {
    const store = useContext(MobxContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Kontroll-Berichte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'popberFolder',
      id: `${pop.id}PopberFolder`,
      tableId: pop.id,
      urlLabel: 'Kontroll-Berichte',
      label: menu.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Kontroll-Berichte',
      ],
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Popbers
              projekt={projekt}
              ap={ap}
              pop={pop}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
