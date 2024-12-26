import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../Row.jsx'
import { nodeFromMenu } from '../../../../../../../../../nodeFromMenu.js'

export const Zielber = memo(({ menu, inProp, parentTransitionState }) => {
  const node = nodeFromMenu(menu)

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
          // also transition if parent is entering
          transitionState={
            parentTransitionState !== 'entered' ? parentTransitionState : state
          }
        />
      )}
    </Transition>
  )
})
