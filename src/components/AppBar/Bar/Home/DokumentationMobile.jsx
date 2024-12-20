import { memo, useState, useCallback } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useLocation, Link } from 'react-router'
import styled from '@emotion/styled'

import { StyledButton } from './index.jsx'
import { useDocsNavData } from '../../../../modules/useDocsNavData.js'

const style = { marginRight: 8 }

export const DokumentationMobile = memo(() => {
  const { pathname, search } = useLocation()
  const isDocs = pathname.startsWith('/Dokumentation')

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const onClickDocsButton = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    [],
  )
  const onClose = useCallback(() => setAnchorEl(null), [])

  const { navData } = useDocsNavData()
  console.log('DokumentationMobile, navData:', navData)

  return (
    <>
      <StyledButton
        id="docs-button"
        aria-controls={open ? 'docs-button' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onClickDocsButton}
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
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': 'docs-button',
        }}
      >
        content
      </Menu>
    </>
  )
})
