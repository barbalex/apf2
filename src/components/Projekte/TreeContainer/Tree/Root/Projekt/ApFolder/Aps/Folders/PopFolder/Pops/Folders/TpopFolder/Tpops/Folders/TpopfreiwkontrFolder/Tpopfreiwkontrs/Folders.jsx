import { memo, useRef, useMemo } from 'react'
import { Transition } from 'react-transition-group'
import styled from '@emotion/styled'

import { transitionStyles } from '../../../../../../../../../../../../../Row.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const TpopfreiwkontrFolders = memo(({ navData, in: inProp }) => {
  const menus = useMemo(
    () => (navData?.menus ?? []).filter((m) => !!m.component),
    [navData],
  )

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
        <Container ref={ref} style={transitionStyles[state]}>
          {menus.map((menu) => (
            <menu.component menu={menu} key={menu.id} />
          ))}
        </Container>
      )}
    </Transition>
  )
})
