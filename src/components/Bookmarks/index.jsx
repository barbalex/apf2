import { memo } from 'react'
import styled from '@emotion/styled'

import { NavTo } from './NavTo/index.jsx'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding: 0 12px;
  height: 40px;
  border-top: rgba(46, 125, 50, 0.5) solid 1px;
  border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
`

export const Bookmarks = memo(() => {
  // TODO:
  // from top do bottom
  // get: bookmarks (label, url) and children (array of same)
  // build ui from bookmarks
  // if children: render as menu
  return (
    <>
      <Container>{`Bookmarks. Window width: ${window.innerWidth}`}</Container>
      <NavTo />
    </>
  )
})
