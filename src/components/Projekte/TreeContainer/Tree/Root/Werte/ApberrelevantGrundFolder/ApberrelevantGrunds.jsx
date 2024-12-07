import { memo } from 'react'

import { useTpopApberrelevantGrundWertesNavData } from '../../../../../../../modules/useTpopApberrelevantGrundWertesNavData.js'
import { ApberrelevantGrund } from './ApberrelevantGrund.jsx'

export const ApberrelevantGrunds = memo(({ in: inProp }) => {
  const { navData } = useTpopApberrelevantGrundWertesNavData()

  return (navData?.menus).map((menu) => (
    <ApberrelevantGrund
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
