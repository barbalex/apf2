import { memo } from 'react'

import { useApsNavData } from '../../../../../../../../modules/useApsNavData.js'
import { Ap } from './Ap.jsx'

export const Aps = memo(({ projekt, in: inProp }) => {
  const { navData } = useApsNavData({ projId: projekt.id })

  return navData?.menus.map((ap) => (
    <Ap
      key={ap.id}
      projekt={projekt}
      ap={ap}
      inProp={inProp}
    />
  ))
})
