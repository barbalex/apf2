import { memo, useCallback, useMemo, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { toggleNodeSymbol } from '../../Projekte/TreeContainer/Tree/toggleNodeSymbol.js'
import { MobxContext } from '../../../mobxContext.js'

const StyledLink = styled(Link)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  align-content: center;
  transition: opacity 700ms ease-in-out;
  user-select: none;
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
  user-select: none;
`

export const Label = memo(
  observer(({ navData, outerContainerRef, labelStyle, ref }) => {
    const { pathname, search } = useLocation()
    const navigate = useNavigate()
    const store = useContext(MobxContext)

    // issue: relative paths are not working!!!???
    // also: need to decode pathname (Zähleinheiten...)
    const pathnameDecoded = decodeURIComponent(pathname)
    const pathnameWithoutLastSlash = pathnameDecoded.replace(/\/$/, '')
    const linksToSomewhereElse = !pathnameWithoutLastSlash.endsWith(navData.url)

    const onClick = useCallback(() => {
      // 1. ensure the clicked element is visible
      const element = outerContainerRef.current
      if (!element) return
      // the timeout needs to be rather long to wait for the transition to finish
      setTimeout(() => {
        element.scrollIntoView({
          inline: 'start',
        })
      }, 1000)
      // 2. sync tree openNodes
      toggleNodeSymbol({
        node: {
          url: navData.url
            .split('/')
            .filter((e) => !!e)
            .slice(1),
        },
        store,
        search,
        navigate,
      })
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

    // tooltip can mess with touch, so hide it on touch devices
    if (!matchMedia('(pointer: coarse)').matches) {
      return <Tooltip title={navData.label}>{label}</Tooltip>
    }
    return label
  }),
)
