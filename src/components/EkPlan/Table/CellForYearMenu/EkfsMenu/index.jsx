import React from 'react'
import Menu from '@mui/material/Menu'

import Ekf from './Ekf'

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

const EkfsMenu = ({ tpop, ekfs, ekfsAnchor, closeEkfsMenu }) => (
  <Menu
    anchorEl={ekfsAnchor}
    open={Boolean(ekfsAnchor)}
    onClose={closeEkfsMenu}
    anchorOrigin={anchorOrigin}
  >
    {ekfs.map((ekf, i) => (
      <Ekf key={ekf.id} tpop={tpop} ekf={ekf} border={i + 1 < ekfs.length} />
    ))}
  </Menu>
)

export default EkfsMenu
