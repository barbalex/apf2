import React from 'react'
import Menu from '@mui/material/Menu'

import Massn from './Massn'

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

const MassnsMenu = ({ tpop, massns, massnsAnchor, closeMassnsMenu }) => {
  return (
    <Menu
      id="massnsMenu"
      anchorEl={massnsAnchor}
      keepMounted
      open={Boolean(massnsAnchor)}
      onClose={closeMassnsMenu}
      anchorOrigin={anchorOrigin}
    >
      {massns.map((massn, i) => (
        <Massn
          key={massn.id}
          tpop={tpop}
          massn={massn}
          border={i + 1 < massns.length}
        />
      ))}
    </Menu>
  )
}

export default MassnsMenu
