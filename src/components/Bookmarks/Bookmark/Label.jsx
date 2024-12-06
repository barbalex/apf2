import { memo, useCallback, forwardRef } from 'react'
import { Link, useLocation } from 'react-router'
import styled from '@emotion/styled'
import { Transition } from 'react-transition-group'

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
  forwardRef(({ navData, outerContainerRef, labelStyle }, labelRef) => {
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

    if (linksToSomewhereElse) {
      return (
        <StyledLink
          to={{ pathname: navData.url, search }}
          onClick={onClick}
          ref={labelRef}
          style={labelStyle}
        >
          {navData.labelShort ?? navData.label}
        </StyledLink>
      )
    }
    return (
      <StyledText
        style={labelStyle}
        ref={labelRef}
      >
        {navData.labelShort ?? navData.label}
      </StyledText>
    )
  }),
)
