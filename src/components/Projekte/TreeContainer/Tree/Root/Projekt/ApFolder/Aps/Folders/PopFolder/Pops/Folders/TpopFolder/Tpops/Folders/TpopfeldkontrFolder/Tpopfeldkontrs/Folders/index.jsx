import { memo, useRef, useMemo } from 'react'
import { Transition } from 'react-transition-group'
import styled from '@emotion/styled'

import { transitionStyles } from '../../../../../../../../../../../../../../Row.jsx'
import { ZaehlFolder } from './ZaehlFolder/index.jsx'
import { Node } from '../../../../../../../../../../../../../../Node.jsx'
import { NodesList } from '../../../../../../../../../../../../../../NodesList/index.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const TpopfeldkontrFolders = memo(
  ({ projekt, ap, pop, tpop, navData, in: inProp }) => {
    const biotopMenu = useMemo(
      () => navData?.menus?.find?.((menu) => menu.id === 'Biotop'),
      [navData],
    )
    const zaehlMenu = useMemo(
      () => navData?.menus?.find?.((menu) => menu.id === 'Zaehlungen'),
      [navData],
    )
    const dateienMenu = useMemo(
      () => navData?.menus?.find?.((menu) => menu.id === 'Dateien'),
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
          <Container
            ref={ref}
            style={transitionStyles[state]}
          >
            <ZaehlFolder
              projekt={projekt}
              ap={ap}
              pop={pop}
              tpop={tpop}
              tpopkontr={navData}
              menu={zaehlMenu}
            />
            <NodesList menu={zaehlMenu} />
            <Node menu={biotopMenu} />
            <Node menu={dateienMenu} />
          </Container>
        )}
      </Transition>
    )
  },
)
