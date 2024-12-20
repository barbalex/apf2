import { memo, useRef } from 'react'
import lowerFirst from 'lodash/lowerFirst'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../Row.jsx'

export const ChildlessFolder = memo(({ projekt, ap, menu, in: inProp }) => {
  const node = {
    nodeType: 'folder',
    menuType: `${lowerFirst(menu.id)}Folder`,
    id: `${ap.id}${menu.id}Folder`,
    tableId: ap.id,
    urlLabel: menu.id,
    label: menu.label,
    url: ['Projekte', projekt.id, 'Arten', ap.id, 'Idealbiotop', 'Dateien'],
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
})
