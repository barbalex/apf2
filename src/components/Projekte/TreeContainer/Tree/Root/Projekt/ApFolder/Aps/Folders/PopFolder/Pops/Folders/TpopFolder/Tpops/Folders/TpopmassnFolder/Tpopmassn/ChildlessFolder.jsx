import { memo, useRef } from 'react'
import lowerFirst from 'lodash/lowerFirst'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../../Row.jsx'

export const ChildlessFolder = memo(
  ({ projekt, ap, pop, tpop, tpopmassn, menu, parentUrl, in: inProp }) => {
    const url = [
      ...parentUrl
        .split('/')
        .filter((el) => el)
        .slice(1),
      menu.id,
    ]

    const node = {
      nodeType: 'folder',
      menuType: `${lowerFirst(menu.id)}Folder`,
      id: `${tpopmassn.id}${menu.id}Folder`,
      tableId: tpopmassn.id,
      urlLabel: menu.id,
      label: menu.label,
      url,
      hasChildren: false,
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
          <Row
            node={node}
            ref={ref}
            transitionState={state}
          />
        )}
      </Transition>
    )
  },
)
