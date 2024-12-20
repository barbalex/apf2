import { memo } from 'react'

import { useAdressesNavData } from '../../../../../../../modules/useAdressesNavData.js'
import { Adresse } from './Adresse.jsx'

export const Adresses = memo(({ in: inProp }) => {
  const { navData } = useAdressesNavData()

  return (navData?.menus ?? []).map((menu) => (
    <Adresse
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
