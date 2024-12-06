import { memo, useCallback, useMemo, forwardRef } from 'react'
import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../JotaiStore/index.js'

const StyledLink = styled(Link)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  align-content: center;
  transition: opacity 700ms ease-in-out;
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
  transition: opacity 700ms ease-in-out;
`

export const Label = memo(
  forwardRef(({ navData, outerContainerRef, labelStyle }, ref) => {
    const { pathname, search } = useLocation()

    // issue: relative paths are not working!!!???
    // also: need to decode pathname (Zähleinheiten...)
    const pathnameDecoded = decodeURIComponent(pathname)
    const pathnameWithoutLastSlash = pathnameDecoded.replace(/\/$/, '')
    const linksToSomewhereElse = !pathnameWithoutLastSlash.endsWith(navData.url)

    const onClick = useCallback(() => {
      const element = outerContainerRef.current
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
            ref={ref}
            style={{ ...labelStyle }}
          >
            {navData.labelShort ?? navData.label}
          </StyledLink>
        : <StyledText
            ref={ref}
            style={{ ...labelStyle }}
          >
            {navData.labelShort ?? navData.label}
          </StyledText>,
      [
        linksToSomewhereElse,
        navData.label,
        navData.labelShort,
        navData.url,
        search,
        labelStyle,
      ],
    )

    const [isDesktopView] = useAtom(isDesktopViewAtom)

    if (isDesktopView) return <Tooltip title={navData.label}>{label}</Tooltip>
    return label
  }),
)
