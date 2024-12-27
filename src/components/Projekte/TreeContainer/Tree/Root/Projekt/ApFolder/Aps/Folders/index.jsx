import { memo, useMemo, useRef } from 'react'
import styled from '@emotion/styled'
import { Transition } from 'react-transition-group'

import { PopFolder } from './PopFolder/index.jsx'
import { useApNavData } from '../../../../../../../../../modules/useApNavData.js'
import { transitionStyles } from '../../../../../Row.jsx'
import { Node } from '../../../../../Node.jsx'
import { NodeWithList } from '../../../../../NodeWithList.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const ApFolders = memo(({ in: inProp, navData }) => {
  const popMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Populationen'),
    [navData],
  )
  const apZielJahrsMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'AP-Ziele'),
    [navData],
  )
  const apErfkritsMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'AP-Erfolgskriterien'),
    [navData],
  )
  const apBerMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'AP-Berichte'),
    [navData],
  )
  const idealbiotopMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Idealbiotop'),
    [navData],
  )
  const apArtMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Taxa'),
    [navData],
  )
  const assozartMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'assoziierte-Arten'),
    [navData],
  )
  const ekfrequenzMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'EK-Frequenzen'),
    [navData],
  )
  const ekzaehleinheitMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'EK-Zähleinheiten'),
    [navData],
  )
  const beobNichtBeurteiltMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'nicht-beurteilte-Beobachtungen'),
    [navData],
  )
  const beobNichtZuzuordnenMenu = useMemo(
    () =>
      navData?.menus.find((m) => m.id === 'nicht-zuzuordnende-Beobachtungen'),
    [navData],
  )
  const qkMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Qualitätskontrollen'),
    [navData],
  )
  const qkWaehlenMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Qualitätskontrollen-wählen'),
    [navData],
  )
  const auswertungMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Auswertung'),
    [navData],
  )
  const dateienMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Dateien'),
    [navData],
  )
  const historienMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Historien'),
    [navData],
  )

  const ref = useRef(null)

  // TODO: map over menus and return their components
  // WHEN: PopFolder has component
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
          <PopFolder menu={popMenu} />
          <NodeWithList menu={apZielJahrsMenu} />
          <NodeWithList menu={apErfkritsMenu} />
          <NodeWithList menu={apBerMenu} />
          <NodeWithList menu={idealbiotopMenu} />
          <NodeWithList menu={apArtMenu} />
          <NodeWithList menu={assozartMenu} />
          <NodeWithList menu={ekfrequenzMenu} />
          <NodeWithList menu={ekzaehleinheitMenu} />
          <NodeWithList menu={beobNichtBeurteiltMenu} />
          <NodeWithList menu={beobNichtZuzuordnenMenu} />
          <Node menu={qkMenu} />
          <Node menu={qkWaehlenMenu} />
          <Node menu={auswertungMenu} />
          <Node menu={dateienMenu} />
          <Node menu={historienMenu} />
        </Container>
      )}
    </Transition>
  )
})
