import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Popmassnbers } from './Popmassnbers.jsx'

export const PopmassnberFolder = memo(
  observer(({ projekt, ap, pop, menu }) => {
    const store = useContext(MobxContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Massnahmen-Berichte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'popmassnberFolder',
      id: `${pop.id}PopmassnberFolder`,
      tableId: pop.id,
      urlLabel: 'Massnahmen-Berichte',
      label: menu.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Massnahmen-Berichte',
      ],
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Popmassnbers
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
