import { memo } from 'react'

import { Row } from '../../Row.jsx'
import { useUsersNavData } from '../../../../../../modules/useUsersNavData.js'

export const Users = memo(() => {
  const { navData } = useUsersNavData()

  return (navData?.menus).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'user',
      id: el.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Benutzer', el.id],
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
