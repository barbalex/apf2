import { memo, useState } from 'react'
import Menu from '@mui/material/Menu'
import { useLocation, Link } from 'react-router'
import styled from '@emotion/styled'

import { StyledButton } from './index.jsx'

const style = { marginRight: 8 }

export const DokumentationMobile = memo(() => {
  const { pathname, search } = useLocation()
  const isDocs = pathname.startsWith('/Dokumentation')

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <StyledButton
        id="docs-button"
        aria-controls={open ? 'docs-button' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant={isDocs ? 'outlined' : 'text'}
        component={Link}
        to={`/Dokumentation/${search}`}
        border={isDocs.toString()}
        style={style}
      >
        Dokumentation
      </StyledButton>
      <Menu
        id="docs-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'docs-button',
        }}
      >
        content
      </Menu>
    </>
  )
})
