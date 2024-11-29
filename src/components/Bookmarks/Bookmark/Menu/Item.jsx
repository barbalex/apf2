import { memo, useCallback } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { Link, useLocation, useNavigate } from 'react-router'
import styled from '@emotion/styled'

export const Item = memo(({ menu, baseUrl, onClose }) => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

  const onClick = useCallback(() => {
    navigate(`${baseUrl ?? pathnameWithoutLastSlash}/${menu.id}${search}`)
    onClose()
  }, [navigate, baseUrl, pathnameWithoutLastSlash, menu.id, search])

  return <MenuItem onClick={onClick}>{menu.label}</MenuItem>
})
