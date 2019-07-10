import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'

export const StyledMenuItem = styled(MenuItem)`
  min-height: 36px !important;
`

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

const EksMenu = ({ eks, eksAnchor, closeEksMenu }) => {
  const [ekAnchor, setEkAnchor] = useState(null)

  return (
    <Menu
      id="eksMenu"
      anchorEl={eksAnchor}
      keepMounted
      open={Boolean(eksAnchor)}
      onClose={closeEksMenu}
      anchorOrigin={anchorOrigin}
      getContentAnchorEl={null}
    >
      {eks.map(ek => (
        <StyledMenuItem
          key={ek.id}
          onClick={e => setEkAnchor(e.currentTarget)}
        >{`${ek.datum || '(kein Datum)'}: ${ek.typ}`}</StyledMenuItem>
      ))}
    </Menu>
  )
}

export default EksMenu
