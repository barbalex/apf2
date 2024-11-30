import { memo } from 'react'

import { Row } from '../../../Row.jsx'
import { useEkAbrechnungstypWertesNavData } from '../../../../../../../modules/useEkAbrechnungstypWertesNavData.js'

export const EkAbrechnungstyp = memo(() => {
  const { navData } = useEkAbrechnungstypWertesNavData()

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'ekAbrechnungstypWerte',
      id: el.id,
      parentId: 'ekAbrechnungstypWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'EkAbrechnungstypWerte', el.id],
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
