import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import {
  Row,
  transitionStyles,
} from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { useTpopfeldkontrNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrNavData.js'
import { TpopfeldkontrFolders } from './Folders/index.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const Tpopfeldkontr = memo(
  observer(({ projekt, ap, pop, tpop, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopfeldkontrNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
      tpopkontrId: menu.id,
    })

    const isOpen =
      menu.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      )

    const node = {
      nodeType: navData.treeNodeType,
      menuType: navData.treeMenuType,
      id: navData.treeId,
      tableId: navData.treeTableId,
      parentId: navData.treeParentId,
      parentTableId: navData.treeParentTableId,
      urlLabel: navData.id,
      label: navData.label,
      url: navData.treeUrl,
      singleElementName: menu.treeSingleElementName,
      hasChildren: navData.hasChildren,
      alwaysOpen: navData.alwaysOpen,
    }

    const ref = useRef(null)

    return (
      <Transition
        in={inProp}
        timeout={300}
        mountOnEnter
        unmountOnExit
        nodeRef={ref}
      >
        {(state) => (
          <>
            <Row
              node={node}
              ref={ref}
              transitionState={state}
            />
            <TransitionGroup component={null}>
              {isOpen && <TpopfeldkontrFolders navData={navData} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
