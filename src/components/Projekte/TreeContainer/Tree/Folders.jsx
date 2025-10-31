import { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Node } from './Node.jsx'
import { NodeWithList } from './NodeWithList.jsx'

import { container } from './Folders.module.css'

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Folders = ({ navData, in: inProp }) => {
  const ref = useRef(null)

  // self menu has no component
  const menus = (navData?.menus ?? []).filter((m) => !!m.component)

  return (
    <Transition
      in={inProp}
      timeout={300}
      mountOnEnter
      unmountOnExit
      nodeRef={ref}
    >
      {(state) => (
        <div
          className={container}
          ref={ref}
          style={transitionStyles[state]}
        >
          {menus.map((menu) => (
            <menu.component
              menu={menu}
              key={menu.id}
            />
          ))}
        </div>
      )}
    </Transition>
  )
}
