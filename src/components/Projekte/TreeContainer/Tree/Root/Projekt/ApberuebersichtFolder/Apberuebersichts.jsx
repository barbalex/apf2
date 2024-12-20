import { memo } from 'react'

import { useApberuebersichtsNavData } from '../../../../../../../modules/useApberuebersichtsNavData.js'
import { Apberuebersicht } from './Apberuebersicht.jsx'

export const Apberuebersichts = memo(({ projekt, in: inProp }) => {
  const projId = projekt.id

  const { navData } = useApberuebersichtsNavData({ projId })

  return navData.menus.map((el) => (
    <Apberuebersicht
      key={el.id}
      projekt={projekt}
      apberuebersicht={el}
      inProp={inProp}
    />
  ))
})
