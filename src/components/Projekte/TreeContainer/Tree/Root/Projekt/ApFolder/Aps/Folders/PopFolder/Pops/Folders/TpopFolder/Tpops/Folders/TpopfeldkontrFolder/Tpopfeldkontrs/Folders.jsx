import { memo, useRef, useMemo } from 'react'
import { Transition } from 'react-transition-group'
import styled from '@emotion/styled'

import { transitionStyles } from '../../../../../../../../../../../../../Row.jsx'
import { Node } from '../../../../../../../../../../../../../Node.jsx'
import { NodeListFolder } from '../../../../../../../../../../../../../NodeListFolder.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const TpopfeldkontrFolders = memo(
  ({ projekt, ap, pop, tpop, navData, in: inProp }) => {
    const ref = useRef(null)

    const menus = useMemo(
      () => (navData?.menus ?? []).filter((m) => !!m.component),
      [navData],
    )

    return (
      <Transition
        in={inProp}
        timeout={300}
        mountOnEnter
        unmountOnExit
        nodeRef={ref}
      >
        {(state) => (
          <Container
            ref={ref}
            style={transitionStyles[state]}
          >
            {menus.map((menu) => (
              <menu.component menu={menu} />
            ))}
          </Container>
        )}
      </Transition>
    )
  },
)
