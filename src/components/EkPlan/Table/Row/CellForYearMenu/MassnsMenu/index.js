import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import get from 'lodash/get'

export const StyledMenuItem = styled(MenuItem)`
  min-height: 36px !important;
`

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

const MassnsMenu = ({ massns, massnsAnchor, closeMassnsMenu }) => {
  const [massnAnchor, setMassnAnchor] = useState(null)

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
      {massns.map(massn => (
        <StyledMenuItem
          key={massn.id}
          onClick={e => setMassnAnchor(e.currentTarget)}
        >{`${massn.datum || '(kein Datum)'}: ${get(
          massn,
          'tpopmassnTypWerteByTyp.text',
        ) || '(kein Typ)'}`}</StyledMenuItem>
      ))}
    </Menu>
  )
}

export default MassnsMenu
