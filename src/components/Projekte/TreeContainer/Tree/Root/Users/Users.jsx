import { memo } from 'react'

import { useUsersNavData } from '../../../../../../modules/useUsersNavData.js'
import { User } from './User.jsx'

export const Users = memo(({ in: inProp }) => {
  const { navData } = useUsersNavData()

  return (navData?.menus).map((menu) => (
    <User
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
