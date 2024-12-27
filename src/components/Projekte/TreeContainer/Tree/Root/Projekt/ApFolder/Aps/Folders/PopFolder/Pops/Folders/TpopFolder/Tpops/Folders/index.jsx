import { memo, useMemo, useRef } from 'react'
import { Transition } from 'react-transition-group'
import styled from '@emotion/styled'

import { TpopfeldkontrFolder } from './TpopfeldkontrFolder/index.jsx'
import { TpopfreiwkontrFolder } from './TpopfreiwkontrFolder/index.jsx'
import { useTpopNavData } from '../../../../../../../../../../../../../../../modules/useTpopNavData.js'
import { transitionStyles } from '../../../../../../../../../../../Row.jsx'
import { Node } from '../../../../../../../../../../../Node.jsx'
import { NodeWithList } from '../../../../../../../../../../../NodeWithList.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const TpopFolders = memo(({ menu, in: inProp }) => {
  const { navData, isLoading } = useTpopNavData(menu.fetcherParams)

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

  // console.log('TpopFolders, tpopmassnMenu:', tpopmassnMenu)

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
          <NodeWithList menu={tpopmassnMenu} />
          <NodeWithList menu={tpopmassnberMenu} />
          <TpopfeldkontrFolder menu={tpopfeldkontrMenu} />
          <TpopfreiwkontrFolder menu={tpopfreiwkontrMenu} />
          <NodeWithList menu={tpopberMenu} />
          <NodeWithList menu={beobZugeordnetMenu} />
          <Node menu={ekMenu} />
          <Node menu={dateienMenu} />
          <Node menu={historienMenu} />
        </Container>
      )}
    </Transition>
  )
})
