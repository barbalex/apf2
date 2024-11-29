import { memo, useCallback } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { Link, useLocation, useNavigate } from 'react-router'
import styled from '@emotion/styled'

const StyledLink = styled(Link)`
  text-decoration: none;
`

export const Item = memo(({ menu, baseUrl, onClose }) => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

  return (
    <MenuItem>
      <StyledLink
        to={{
          pathname: `${baseUrl ?? pathnameWithoutLastSlash}/${menu.id}`,
          search,
        }}
        onClick={onClose}
      >
        {menu.label}
      </StyledLink>
    </MenuItem>
  )
})
