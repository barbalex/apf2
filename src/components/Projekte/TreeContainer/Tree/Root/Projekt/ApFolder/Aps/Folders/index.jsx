import { memo, useMemo } from 'react'

import { PopFolder } from './Pop/index.jsx'
import { ApZielJahrs } from './ApZielJahrs/index.jsx'
import { ApErfkritFolder } from './ApErfkrit/index.jsx'
import { ApBerFolder } from './ApBer/index.jsx'
import { IdealbiotopFolder } from './Idealbiotop.jsx'
import { ApArtFolder } from './ApArt/index.jsx'
import { AssozArtFolder } from './AssozArt/index.jsx'
import { EkFrequenzFolder } from './EkFrequenz/index.jsx'
import { EkZaehleinheitFolder } from './EkZaehleinheit/index.jsx'
import { BeobNichtBeurteiltFolder } from './BeobNichtBeurteilt/index.jsx'
import { BeobNichtZuzuordnenFolder } from './BeobNichtZuzuordnen/index.jsx'
import { Qk } from './Qk.jsx'
import { useApNavData } from '../../../../../../../../../modules/useApNavData.js'

export const ApFolders = memo(({ ap, projekt }) => {
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

  return (
    <>
      <PopFolder
        projekt={projekt}
        ap={ap}
        menu={popMenu}
      />
      <ApZielJahrs
        projekt={projekt}
        ap={ap}
        menu={apZielJahrsMenu}
      />
      <ApErfkritFolder
        projekt={projekt}
        ap={ap}
        menu={apErfkritsMenu}
      />
      <ApBerFolder
        projekt={projekt}
        ap={ap}
        menu={apBerMenu}
      />
      <IdealbiotopFolder
        projekt={projekt}
        ap={ap}
      />
      <ApArtFolder
        projekt={projekt}
        ap={ap}
        menu={apArtMenu}
      />
      <AssozArtFolder
        projekt={projekt}
        ap={ap}
        menu={assozartMenu}
      />
      <EkFrequenzFolder
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
    </>
  )
})
