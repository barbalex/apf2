import React from 'react'
import Menu from '@material-ui/core/Menu'

import Massn from './Massn'

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

const MassnsMenu = ({ massns, massnsAnchor, closeMassnsMenu }) => {
  return (
    <Menu
      id="massnsMenu"
      anchorEl={massnsAnchor}
      keepMounted
      open={Boolean(massnsAnchor)}
      onClose={closeMassnsMenu}
      anchorOrigin={anchorOrigin}
      getContentAnchorEl={null}
    >
      {massns.map((massn, i) => (
        <Massn key={massn.id} massn={massn} border={i + 1 < massns.length} />
      ))}
    </Menu>
  )
}

export default MassnsMenu
