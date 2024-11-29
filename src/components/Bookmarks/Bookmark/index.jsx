import { memo } from 'react'
import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import { Menu } from './Menu/index.jsx'
import styled from '@emotion/styled'

const StyledLink = styled(Link)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    text-decoration-color: rgba(55, 118, 28, 0.5);
  }
`
const StyledText = styled.div`
  min-width: 50px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const Container = styled.div`
  padding: 0 9px;
  min-width: 80px;
  max-width: 180px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Bookmark = memo(({ navData }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')
  const linksToSomewhereElse = !pathnameWithoutLastSlash.endsWith(
    navData.id || `${navData.id}/`,
  )

  const label = `${navData.label} (${navData.menus.length}/${navData.totalCount})`

  return (
    <Tooltip title={label}>
      <Container>
        {linksToSomewhereElse ?
          <StyledLink to={{ pathname: navData.url, search }}>
            {label}
          </StyledLink>
        : <StyledText>{label}</StyledText>}
        <Menu />
      </Container>
    </Tooltip>
  )
})
