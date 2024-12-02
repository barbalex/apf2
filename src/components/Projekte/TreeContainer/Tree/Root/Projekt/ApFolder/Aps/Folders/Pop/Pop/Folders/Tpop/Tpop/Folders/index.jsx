import { memo, useMemo } from 'react'

import { TpopMassnFolder } from './TpopMassn/index.jsx'
import { TpopMassnBerFolder } from './TpopMassnBer/index.jsx'
import { TpopFeldkontrFolder } from './TpopFeldkontr/index.jsx'
import { TpopFreiwkontrFolder } from './TpopFreiwkontr/index.jsx'
import { TpopBerFolder } from './TpopBer/index.jsx'
import { BeobZugeordnetFolder } from './BeobZugeordnet/index.jsx'
import { useTpopNavData } from '../../../../../../../../../../../../../../../modules/useTpopNavData.js'

export const TpopFolders = memo(({ projekt, ap, pop, tpop }) => {
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

  // console.log('Tree TPopFolders', { ekGqlFilterForTree, ekfGqlFilterForTree })

  return (
    <>
      <TpopMassnFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        menu={tpopmassnMenu}
      />
      <TpopMassnBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        menu={tpopmassnberMenu}
      />
      <TpopFeldkontrFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        menu={tpopfeldkontrMenu}
      />
      <TpopFreiwkontrFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        menu={tpopfreiwkontrMenu}
      />
      <TpopBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        menu={tpopberMenu}
      />
      <BeobZugeordnetFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        menu={beobZugeordnetMenu}
      />
    </>
  )
})
