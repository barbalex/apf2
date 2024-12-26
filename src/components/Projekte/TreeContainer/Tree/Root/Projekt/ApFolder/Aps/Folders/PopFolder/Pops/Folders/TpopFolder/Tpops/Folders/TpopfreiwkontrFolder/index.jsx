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

    const isOpen = checkIfIsOpen({ store, menu })

    const node = nodeFromMenu(menu)

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Tpopfreiwkontrs
              projekt={projekt}
              ap={ap}
              pop={pop}
              tpop={tpop}
              menu={menu}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
