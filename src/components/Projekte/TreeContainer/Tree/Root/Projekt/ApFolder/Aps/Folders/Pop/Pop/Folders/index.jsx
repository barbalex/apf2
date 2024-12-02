import { memo } from 'react'

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

  return (
    <>
      <TpopFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        menu={navData.menus.find((m) => m.id === 'Teil-Populationen')}
      />
      <PopBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        menu={navData.menus.find((m) => m.id === 'Kontroll-Berichte')}
      />
      <PopMassnBerFolder
        projekt={projekt}
        ap={ap}
        pop={pop}
        menu={navData.menus.find((m) => m.id === 'Massnahmen-Berichte')}
      />
    </>
  )
})
