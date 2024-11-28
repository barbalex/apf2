import { memo } from 'react'
import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { navData } from '../NavTo/Navs/Projects'

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0 9px;
  min-width: 50px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    text-decoration: ${(props) =>
      props.islink === 'true' ? 'underline' : 'none'};
    text-decoration-color: rgba(55, 118, 28, 0.5);
  }
`

export const Bookmark = memo(({ navData }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')
  const linksToSomewhereElse = pathnameWithoutLastSlash.endsWith(
    navData.id || `${navData.id}/`,
  )

  const label = `${navData.label} (${navData.menus.length}/${navData.totalCount})`

  return (
    <Tooltip title={label}>
      <StyledLink
        to={{ pathname: `${pathnameWithoutLastSlash}/${navData.id}`, search }}
        islink={linksToSomewhereElse.toString()}
      >
        {label}
      </StyledLink>
    </Tooltip>
  )
})
