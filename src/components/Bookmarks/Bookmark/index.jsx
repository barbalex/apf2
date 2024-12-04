import { memo, useCallback, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import { Menu } from './Menu/index.jsx'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../JotaiStore/index.js'

const minWidth = 50
const maxWidth = 150
const menuWidth = 40

const OuterContainer = styled.div`
  position: relative;
  &::after,
  &::before {
    background: rgb(255, 253, 231);
    bottom: 0;
    clip-path: polygon(50% 50%, -50% -50%, 0 100%);
    content: '';
    left: 100%;
    position: absolute;
    top: 0;
    transition: background 0.2s linear;
    width: 2em;
    z-index: 1;
  }
  // TODO: change calculations if padding was changed (was 9+9)
  // now: per menu 7px more padding plus 15px on right
  padding-left: 25px;
  &:last-of-type {
    // border-left: 1.5px solid rgb(46, 125, 50);
    padding-left: 10px;
  }
  &:first-of-type {
    margin-right: 15px;
  }
`
const Container = styled.div`
  margin-right: -10px;
  position: relative;
  border-collapse: collapse;
  transition: background 0.2s linear;
  max-width: 45vw;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  &::after,
  &::before {
    background: rgb(46, 125, 50);
    bottom: 0;
    clip-path: polygon(50% 50%, -50% -50%, 0 100%);
    content: '';
    left: calc(100% - 8.3px);
    position: absolute;
    top: 0.5px;
    transition: background 0.2s linear;
    width: 2em;
    z-index: 1;
  }
  &::before {
    background: rgb(255, 253, 231);
    margin-left: 1px;
  }
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-content: center;
`

export const Bookmark = memo(({ navData }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  // also: need to decode pathname (Zähleinheiten...)
  const pathnameDecoded = decodeURIComponent(pathname)
  const pathnameWithoutLastSlash = pathnameDecoded.replace(/\/$/, '')
  const linksToSomewhereElse = !pathnameWithoutLastSlash.endsWith(navData.url)

  const ref = useRef(null)

  const onClick = useCallback(() => {
    const element = ref.current
    if (!element) return
    setTimeout(() => {
      element.scrollIntoView({
        inline: 'start',
      })
    }, 200)
  }, [])

  const label = useMemo(
    () =>
      linksToSomewhereElse ?
        <StyledLink
          to={{ pathname: navData.url, search }}
          onClick={onClick}
        >
          {navData.labelShort ?? navData.label}
        </StyledLink>
      : <StyledText>{navData.labelShort ?? navData.label}</StyledText>,
    [
      linksToSomewhereElse,
      navData.label,
      navData.labelShort,
      navData.url,
      search,
    ],
  )

  const [isDesktopView] = useAtom(isDesktopViewAtom)

  // don't add tooltip on mobile as longpress opens menu
  return (
    <OuterContainer ref={ref}>
      <Container>
        {isDesktopView ?
          <Tooltip title={navData.label}>{label}</Tooltip>
        : label}
        {!!navData.menus && <Menu navData={navData} />}
      </Container>
    </OuterContainer>
  )
})
