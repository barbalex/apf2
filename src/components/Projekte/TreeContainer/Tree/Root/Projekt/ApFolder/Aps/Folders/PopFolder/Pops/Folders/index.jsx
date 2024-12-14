import { memo, useMemo, useRef } from 'react'
import styled from '@emotion/styled'
import { Transition } from 'react-transition-group'

import { TpopFolder } from './TpopFolder/index.jsx'
import { PopberFolder } from './PopberFolder/index.jsx'
import { PopmassnberFolder } from './PopmassnberFolder/index.jsx'
import { usePopNavData } from '../../../../../../../../../../../../modules/usePopNavData.js'
import { transitionStyles } from '../../../../../../../../Row.jsx'
import { ChildlessFolder } from './ChildlessFolder.jsx'
import { da } from 'date-fns/locale'

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
  const auswertungMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Auswertung'),
    [navData.menus],
  )
  const dateienMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Dateien'),
    [navData.menus],
  )
  const historienMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Historien'),
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
          <ChildlessFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            menu={auswertungMenu}
            parentUrl={navData?.url}
          />
          <ChildlessFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            menu={dateienMenu}
            parentUrl={navData?.url}
          />
          <ChildlessFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            menu={historienMenu}
            parentUrl={navData?.url}
          />
        </Container>
      )}
    </Transition>
  )
})
