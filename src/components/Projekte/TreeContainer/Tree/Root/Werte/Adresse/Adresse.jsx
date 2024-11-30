import { memo } from 'react'

import { Row } from '../../../Row.jsx'
import { useAdressesNavData } from '../../../../../../../modules/useAdressesNavData.js'

export const Adresse = memo(() => {
  const { navData } = useAdressesNavData()

  return (navData?.menus ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'adresse',
      id: el.id,
      parentId: 'adresseFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'Adressen', el.id],
      hasChildren: false,
    }

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
})
