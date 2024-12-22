import { memo, useMemo, useRef } from 'react'
import styled from '@emotion/styled'
import { Transition } from 'react-transition-group'

import { PopFolder } from './PopFolder/index.jsx'
import { ApzieljahrFolder } from './ApzieljahrFolder/index.jsx'
import { AperfkritFolder } from './AperfkritFolder/index.jsx'
import { ApberFolder } from './ApberFolder/index.jsx'
import { IdealbiotopFolder } from './IdealbiotopFolder/index.jsx'
import { ApartFolder } from './ApartFolder/index.jsx'
import { AssozartFolder } from './AssozartFolder/index.jsx'
import { EkfrequenzFolder } from './EkfrequenzFolder/index.jsx'
import { EkZaehleinheitFolder } from './EkzaehleinheitFolder/index.jsx'
import { BeobNichtBeurteiltFolder } from './BeobNichtBeurteiltFolder/index.jsx'
import { BeobNichtZuzuordnenFolder } from './BeobNichtZuzuordnenFolder/index.jsx'
import { Qk } from './Qk.jsx'
import { QkWaehlen } from './QkWaehlen.jsx'
import { useApNavData } from '../../../../../../../../../modules/useApNavData.js'
import { transitionStyles } from '../../../../../Row.jsx'
import { ChildlessFolder } from '../../../../../ChildlessFolder.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const ApFolders = memo(({ ap, projekt, in: inProp }) => {
  const { navData, isLoading } = useApNavData({ apId: ap.id })

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
          <PopFolder
            projekt={projekt}
            ap={ap}
            menu={popMenu}
          />
          <ApzieljahrFolder
            projekt={projekt}
            ap={ap}
            menu={apZielJahrsMenu}
          />
          <AperfkritFolder
            projekt={projekt}
            ap={ap}
            menu={apErfkritsMenu}
          />
          <ApberFolder
            projekt={projekt}
            ap={ap}
            menu={apBerMenu}
          />
          <IdealbiotopFolder
            projekt={projekt}
            ap={ap}
          />
          <ApartFolder
            projekt={projekt}
            ap={ap}
            menu={apArtMenu}
          />
          <AssozartFolder
            projekt={projekt}
            ap={ap}
            menu={assozartMenu}
          />
          <EkfrequenzFolder
            projekt={projekt}
            ap={ap}
            menu={ekfrequenzMenu}
          />
          <EkZaehleinheitFolder
            projekt={projekt}
            ap={ap}
            menu={ekzaehleinheitMenu}
          />
          <BeobNichtBeurteiltFolder
            projekt={projekt}
            ap={ap}
            menu={beobNichtBeurteiltMenu}
          />
          <BeobNichtZuzuordnenFolder
            projekt={projekt}
            ap={ap}
            menu={beobNichtZuzuordnenMenu}
          />
          <Qk
            projekt={projekt}
            ap={ap}
          />
          <QkWaehlen
            projekt={projekt}
            ap={ap}
          />
          <ChildlessFolder menu={auswertungMenu} />
          <ChildlessFolder menu={dateienMenu} />
          <ChildlessFolder menu={historienMenu} />
        </Container>
      )}
    </Transition>
  )
})
