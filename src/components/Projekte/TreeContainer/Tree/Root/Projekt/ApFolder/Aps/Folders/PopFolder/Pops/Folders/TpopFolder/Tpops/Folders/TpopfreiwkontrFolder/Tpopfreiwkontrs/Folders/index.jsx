import { memo, useRef, useMemo } from 'react'
import { Transition } from 'react-transition-group'
import styled from '@emotion/styled'

import { transitionStyles } from '../../../../../../../../../../../../../../Row.jsx'
import { ZaehlFolder } from './ZaehlFolder/index.jsx'
import { ChildlessFolder } from './ChildlessFolder.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const TpopfreiwkontrFolders = memo(
  ({ projekt, ap, pop, tpop, navData, in: inProp }) => {
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
            <ChildlessFolder
              projekt={projekt}
              ap={ap}
              pop={pop}
              tpop={tpop}
              menu={dateienMenu}
              parentUrl={navData.url}
            />
            <ZaehlFolder
              projekt={projekt}
              ap={ap}
              pop={pop}
              tpop={tpop}
              tpopkontr={navData}
              menu={zaehlMenu}
              parentUrl={navData.url}
            />
          </Container>
        )}
      </Transition>
    )
  },
)
