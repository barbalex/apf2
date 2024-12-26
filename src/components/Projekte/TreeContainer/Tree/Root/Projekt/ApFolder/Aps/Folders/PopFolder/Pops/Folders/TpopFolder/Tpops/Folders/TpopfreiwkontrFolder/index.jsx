import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../mobxContext.js'
import { Tpopfreiwkontrs } from './Tpopfreiwkontrs/index.jsx'
import { checkIfIsOpen } from '../../../../../../../../../../../../checkIfIsOpen.js'
import { nodeFromMenu } from '../../../../../../../../../../../../nodeFromMenu.js'

export const TpopfreiwkontrFolder = memo(
  observer(({ projekt, ap, pop, tpop, menu }) => {
    const store = useContext(MobxContext)

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'Populationen',
      pop.id,
      'Teil-Populationen',
      tpop.id,
      'Freiwilligen-Kontrollen',
    ]

    const isOpen = checkIfIsOpen({ store, menu })

    const node = {
      nodeType: 'folder',
      menuType: 'tpopfreiwkontrFolder',
      id: `${tpop.id}TpopfreiwkontrFolder`,
      tableId: tpop.id,
      urlLabel: 'Freiwilligen-Kontrollen',
      label: menu.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Tpopfreiwkontrs projekt={projekt} ap={ap} pop={pop} tpop={tpop} />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
