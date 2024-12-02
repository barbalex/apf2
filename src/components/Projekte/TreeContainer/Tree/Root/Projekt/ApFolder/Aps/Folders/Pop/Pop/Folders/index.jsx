import { memo, useMemo } from 'react'

import { TpopFolder } from './Tpop/index.jsx'
import { PopBerFolder } from './PopBer/index.jsx'
import { PopMassnBerFolder } from './PopMassnBer/index.jsx'
import { usePopNavData } from '../../../../../../../../../../../../modules/usePopNavData.js'

export const PopFolders = memo(({ projekt, ap, pop }) => {
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

  return (
    <>
      <TpopFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        menu={tpopMenu}
      />
      <PopBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        menu={popberMenu}
      />
      <PopMassnBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        menu={popmassnberMenu}
      />
    </>
  )
})
