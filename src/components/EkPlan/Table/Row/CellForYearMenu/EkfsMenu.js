import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'

export const StyledMenuItem = styled(MenuItem)`
  min-height: 36px !important;
`

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

const EkfsMenu = ({ ekfs, ekfsAnchor, closeEkfsMenu }) => {
  const [ekfAnchor, setEkfAnchor] = useState(null)

  return (
    <Menu
      id="ekfsMenu"
      anchorEl={ekfsAnchor}
      keepMounted
      open={Boolean(ekfsAnchor)}
      onClose={closeEkfsMenu}
      anchorOrigin={anchorOrigin}
      getContentAnchorEl={null}
    >
      {ekfs.map(ek => (
        <StyledMenuItem
          key={ek.id}
          onClick={e => setEkfAnchor(e.currentTarget)}
        >{`${ek.datum || '(kein Datum)'}: ${ek.typ}`}</StyledMenuItem>
      ))}
    </Menu>
  )
}

export default EkfsMenu
