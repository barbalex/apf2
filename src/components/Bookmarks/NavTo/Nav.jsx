import { memo } from 'react'
import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0 9px;
  min-width: 50px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-right: ${(props) =>
    props.borderright === 'true' ? 'rgba(46, 125, 50, 0.5) solid 1px' : 'none'};
  &:hover {
    text-decoration: underline;
    text-decoration-color: rgba(55, 118, 28, 0.5);
  }
`

export const Nav = memo(({ item, baseUrl, needsBorderRight = false }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

  return (
    <Tooltip title={item.label}>
      <StyledLink
        to={{
          pathname: `${baseUrl ?? pathnameWithoutLastSlash}/${item.id}`,
          search,
        }}
        borderright={needsBorderRight.toString()}
      >
        {item.label}
      </StyledLink>
    </Tooltip>
  )
})
