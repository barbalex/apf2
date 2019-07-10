import React from 'react'
import Menu from '@material-ui/core/Menu'

import Ek from './Ek'

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

const EksMenu = ({ tpop, eks, eksAnchor, closeEksMenu }) => (
  <Menu
    id="eksMenu"
    anchorEl={eksAnchor}
    keepMounted
    open={Boolean(eksAnchor)}
    onClose={closeEksMenu}
    anchorOrigin={anchorOrigin}
    getContentAnchorEl={null}
  >
    {eks.map((ek, i) => (
      <Ek key={ek.id} tpop={tpop} ek={ek} border={i + 1 < eks.length} />
    ))}
  </Menu>
)

export default EksMenu
