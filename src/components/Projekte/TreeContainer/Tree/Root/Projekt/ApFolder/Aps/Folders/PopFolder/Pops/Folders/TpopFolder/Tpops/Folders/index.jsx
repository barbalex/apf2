import { memo, useMemo, useRef } from 'react'
import { Transition } from 'react-transition-group'
import styled from '@emotion/styled'

import { TpopmassnFolder } from './TpopmassnFolder/index.jsx'
import { TpopmassnberFolder } from './TpopmassnberFolder/index.jsx'
import { TpopfeldkontrFolder } from './TpopfeldkontrFolder/index.jsx'
import { TpopfreiwkontrFolder } from './TpopfreiwkontrFolder/index.jsx'
import { TpopberFolder } from './TpopberFolder/index.jsx'
import { BeobzugeordnetFolder } from './BeobzugeordnetFolder/index.jsx'
import { useTpopNavData } from '../../../../../../../../../../../../../../../modules/useTpopNavData.js'
import { ChildlessFolder } from './ChildlessFolder.jsx'
import { transitionStyles } from '../../../../../../../../../../../Row.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const TpopFolders = memo(({ projekt, ap, pop, tpop, in: inProp }) => {
  const { navData, isLoading } = useTpopNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  const tpopmassnMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'Massnahmen'),
    [navData],
  )
  const tpopmassnberMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'Massnahmen-Berichte'),
    [navData],
  )
  const tpopfeldkontrMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'Feld-Kontrollen'),
    [navData],
  )
  const tpopfreiwkontrMenu = useMemo(
    () =>
      navData?.menus?.find?.((menu) => menu.id === 'Freiwilligen-Kontrollen'),
    [navData],
  )
  const tpopberMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'Kontroll-Berichte'),
    [navData],
  )
  const beobZugeordnetMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'Beobachtungen'),
    [navData],
  )
  const ekMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'EK'),
    [navData],
  )
  const dateienMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'Dateien'),
    [navData],
  )
  const historienMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'Historien'),
    [navData],
  )

  const ref = useRef(null)

  // console.log('Tree TPopFolders', { ekGqlFilterForTree, ekfGqlFilterForTree })

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
          <TpopmassnFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={tpopmassnMenu}
          />
          <TpopmassnberFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={tpopmassnberMenu}
          />
          <TpopfeldkontrFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={tpopfeldkontrMenu}
          />
          <TpopfreiwkontrFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={tpopfreiwkontrMenu}
          />
          <TpopberFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={tpopberMenu}
          />
          <BeobzugeordnetFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={beobZugeordnetMenu}
          />
          <ChildlessFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={ekMenu}
            parentUrl={navData.url}
          />
          <ChildlessFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={dateienMenu}
            parentUrl={navData.url}
          />
          <ChildlessFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            menu={historienMenu}
            parentUrl={navData.url}
          />
        </Container>
      )}
    </Transition>
  )
})
