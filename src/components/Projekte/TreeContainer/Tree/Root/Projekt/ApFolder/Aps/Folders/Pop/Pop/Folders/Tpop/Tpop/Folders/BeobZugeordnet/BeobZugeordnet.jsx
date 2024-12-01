import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useBeobZugeordnetsNavData } from '../../../../../../../../../../../../../../../../modules/useBeobZugeordnetsNavData.js'

export const BeobZugeordnet = memo(({ projekt, ap, pop, tpop }) => {
  const { navData } = useBeobZugeordnetsNavData({ tpopId: tpop.id })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'beobZugeordnet',
      id: el.id,
      parentId: `${tpop.id}BeobZugeordnetFolder`,
      parentTableId: tpop.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        tpop.id,
        'Beobachtungen',
        el.id,
      ],
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
