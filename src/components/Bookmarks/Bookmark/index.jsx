import { memo } from 'react'
import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import { Menu } from './Menu/index.jsx'
import styled from '@emotion/styled'

const minWidth = 50
const maxWidth = 150
const menuWidth = 40

const Container = styled.div`
  padding: 0 9px;
  min-width: ${minWidth + menuWidth}px;
  max-width: ${maxWidth + menuWidth}px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
`
const StyledLink = styled(Link)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  align-content: center;
  &:hover {
    text-decoration: underline;
    text-decoration-color: rgba(55, 118, 28, 0.5);
  }
`
const StyledText = styled.div`
  min-width: ${minWidth}px;
  max-width: ${maxWidth}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-content: center;
`

export const Bookmark = memo(({ navData }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')
  const linksToSomewhereElse = !pathnameWithoutLastSlash.endsWith(navData.url)

  // let label = `${navData.label}${!!navData.menus && !!navData.totalCount ? ` (${navData.menus.length}/${navData.totalCount})` : ''}`
  // if (navData.nonFilterable) label = `${navData.label} (${navData.totalCount})`

  return (
    <Container>
      <Tooltip title={navData.label}>
        {linksToSomewhereElse ?
          <StyledLink to={{ pathname: navData.url, search }}>
            {navData.labelShort ?? navData.label}
          </StyledLink>
        : <StyledText>{navData.labelShort ?? navData.label}</StyledText>}
      </Tooltip>
      {!!navData.menus && <Menu navData={navData} />}
    </Container>
  )
})
