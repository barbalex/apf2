import { memo, useMemo, useRef } from 'react'
import styled from '@emotion/styled'
import { Transition } from 'react-transition-group'

import { TpopFolder } from './Tpop/index.jsx'
import { PopberFolder } from './Popber/index.jsx'
import { PopmassnberFolder } from './Popmassnber/index.jsx'
import { usePopNavData } from '../../../../../../../../../../../../modules/usePopNavData.js'
import { transitionStyles } from '../../../../../../../../Row.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const PopFolders = memo(({ projekt, ap, pop, in: inProp }) => {
  const { navData } = usePopNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
  })

  const tpopMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Teil-Populationen'),
    [navData.menus],
  )
  const popberMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Kontroll-Berichte'),
    [navData.menus],
  )
  const popmassnberMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Massnahmen-Berichte'),
    [navData.menus],
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
          <TpopFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            menu={tpopMenu}
          />
          <PopberFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            menu={popberMenu}
          />
          <PopmassnberFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            menu={popmassnberMenu}
          />
        </Container>
      )}
    </Transition>
  )
})
