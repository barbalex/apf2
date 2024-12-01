import { memo } from 'react'

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

  return (
    <>
      <PopFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'Populationen')}
      />
      <ApZielJahrs
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'AP-Ziele')}
      />
      <ApErfkritFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'AP-Erfolgskriterien')}
      />
      <ApBerFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'AP-Berichte')}
      />
      <IdealbiotopFolder
        projekt={projekt}
        ap={ap}
      />
      <ApArtFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'Taxa')}
      />
      <AssozArtFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'assoziierte-Arten')}
      />
      <EkFrequenzFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'EK-Frequenzen')}
      />
      <EkZaehleinheitFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find((m) => m.id === 'EK-Zähleinheiten')}
      />
      <BeobNichtBeurteiltFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find(
          (m) => m.id === 'nicht-beurteilte-Beobachtungen',
        )}
      />
      <BeobNichtZuzuordnenFolder
        projekt={projekt}
        ap={ap}
        menu={navData?.menus.find(
          (m) => m.id === 'nicht-zuzuordnende-Beobachtungen',
        )}
      />
      <Qk
        projekt={projekt}
        ap={ap}
      />
    </>
  )
})
